import { v4 as uuid } from 'uuid';
import { Request, Response } from 'express';
import { ExecutionParams } from 'subscriptions-transport-ws';
import { Connection } from 'typeorm';
import { verify, TokenExpiredError } from 'jsonwebtoken';

import { User } from '../db/models/User';
import { getEnvironment } from '../utils/env';
import { EsmereldaGraphQLError } from './error';
import { graphqlErrors } from '../errors';

interface IExpressContext {
    req: Request;
    res: Response;
    connection?: ExecutionParams;
}

export interface IEsmereldaContext<T = void> {
    db: Connection;
    req: Request;
    res: Response;
    connection?: ExecutionParams;
    requestId: string;
    user: T extends User ? T : undefined;
}

export type AuthenticatedEsmereldaContext = IEsmereldaContext<User>;

export interface IDecodedAuthToken {
    id: User['id'];
}

export interface IDecodedRefreshToken {
    id: User['id'];
}

/**
 * Decodes an authToken and returns the associated user
 * @param authToken Authentication Token
 * @returns The decoded user identifier
 */
const resolveAuthenticatedUser = async (authToken?: string): Promise<User | undefined> => {
    if (!authToken) {
        return;
    }

    try {
        const { JWT_AUTH_SECRET } = getEnvironment();
        const payload = verify(authToken, JWT_AUTH_SECRET) as IDecodedAuthToken;

        return await User.findOne({
            where: { id: payload.id }
        });
    } catch (err) {
        if (!(err instanceof TokenExpiredError)) {
            throw new EsmereldaGraphQLError(graphqlErrors.AUTHENTICATION_TOKEN_INVALID);
        }
    }
};

/**
 * Creates an Apollo Context for each incoming HTTP request
 * @param db Database Connection
 * @returns Function which returns a EsmereldaContext
 */
export const createContext = (db: Connection) => {
    return async ({
        req,
        res,
        connection
    }: IExpressContext): Promise<IEsmereldaContext | AuthenticatedEsmereldaContext> => {
        let authToken: string | undefined;

        if (connection?.context) {
            /** Retreives the Bearer token from Subscription Authorization param */
            authToken = connection?.context.authorization?.split('Bearer ')[1];
        } else {
            /** Retreives the Bearer token from Authorization header */
            authToken = req.headers.authorization?.split('Bearer ')[1];
        }

        return {
            db,
            req,
            res,
            connection,
            requestId: uuid(),
            user: await resolveAuthenticatedUser(authToken)
        };
    };
};
