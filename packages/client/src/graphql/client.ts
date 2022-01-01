import {ApolloClient, InMemoryCache} from '@apollo/client';

export const client = new ApolloClient({
    uri: 'localhost:3001/graphql',
    cache: new InMemoryCache(),
    credentials: 'include'
});
