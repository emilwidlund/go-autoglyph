import {ApolloClient, ApolloLink, from, fromPromise, HttpLink, InMemoryCache, Operation} from '@apollo/client';
import {onError} from '@apollo/client/link/error';
import {Alert} from 'react-native';

import {IRefreshTokenQueryResults, ILogoutQueryResults} from './queries';
import {REFRESH_TOKEN_QUERY, LOGOUT_QUERY} from './queries/auth';

export interface AuthContext {
    authToken: string | null;
    authTokenExpiry: number | null;
    clear(): Promise<void>;
}

export const authContext: AuthContext = {
    authToken: null,
    authTokenExpiry: null,
    clear: async function () {
        this.authToken = null;
        this.authTokenExpiry = null;

        await client.query<ILogoutQueryResults>({query: LOGOUT_QUERY});
    }
};

const authLink = new ApolloLink((operation, forward) => {
    if (authContext.authToken) {
        operation.setContext({
            headers: {
                ...operation.getContext().headers,
                Authorization: `Bearer ${authContext.authToken}`
            }
        });
    }

    return forward(operation).map(op => {
        const data = op ? op.data : undefined;
        const auth = data ? data.authenticate || data.refreshToken : undefined;

        if (auth) {
            authContext.authToken = auth.token;
            authContext.authTokenExpiry = auth.expiresIn;
        }

        return operation;
    });
});

const refreshToken = async (): Promise<IRefreshTokenQueryResults> => {
    const {data} = await client.query<IRefreshTokenQueryResults>({
        query: REFRESH_TOKEN_QUERY,
        fetchPolicy: 'network-only'
    });

    return Object.assign(
        {
            refreshToken: {}
        },
        data
    );
};

const setAuth = (operation: Operation, token: string, expiresIn: number): Operation => {
    authContext.authToken = token ?? null;
    authContext.authTokenExpiry = expiresIn ?? null;

    if (token) {
        operation.setContext({
            headers: {
                ...operation.getContext().headers,
                Authorization: `Bearer ${authContext.authToken}`
            }
        });
    }

    return operation;
};

const panic = async (operation: Operation): Promise<Operation> => {
    await authContext.clear();
    client.stop();
    await client.resetStore();

    return operation;
};

const errorLink = onError(({graphQLErrors, operation, forward}) => {
    if (graphQLErrors) {
        for (let err of graphQLErrors) {
            Alert.alert(err.message);

            switch (err.extensions?.code) {
                case '20000':
                    return fromPromise<Operation>(panic(operation)).flatMap(forward);
                case '20001':
                    return fromPromise(refreshToken()).flatMap(({refreshToken: {token, expiresIn}}) =>
                        forward(setAuth(operation, token, expiresIn))
                    );
                case '20002':
                    return fromPromise<Operation>(panic(operation)).flatMap(forward);
                case '20004':
                    return fromPromise(refreshToken()).flatMap(({refreshToken: {token, expiresIn}}) =>
                        forward(setAuth(operation, token, expiresIn))
                    );
            }
        }
    }
});

const httpLink = new HttpLink({
    uri: 'https://127.0.0.1:3001/graphql',
    credentials: 'include'
});

export const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: from([errorLink, authLink, httpLink])
});
