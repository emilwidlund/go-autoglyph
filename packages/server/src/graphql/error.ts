import { ApolloError } from 'apollo-server-errors';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { QueryFailedError } from 'typeorm';

import { graphqlErrors, IError } from '../errors';

export class EsmereldaGraphQLError extends ApolloError {
    constructor(error: IError) {
        super(error.message, error.code.toString());

        Object.defineProperty(this, 'name', { value: error.title });
    }
}

/**
 * Formats errors thrown in GraphQL
 * @param err GraphQL Error
 * @returns Formatted Error
 */
export const errorFormatter: (error: GraphQLError) => GraphQLFormattedError<Record<string, any>> = err => {
    switch (true) {
        case err.originalError instanceof QueryFailedError:
            return new EsmereldaGraphQLError(graphqlErrors.GENERIC_INTERNAL_SERVER_ERROR);
        case err.message.startsWith('Context creation failed: '):
            return err;
        default:
            return err;
    }
};
