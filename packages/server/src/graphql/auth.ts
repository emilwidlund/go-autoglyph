import { AuthChecker } from 'type-graphql';

import { graphqlErrors } from '../errors';
import { IEsmereldaContext } from './context';
import { EsmereldaGraphQLError } from './error';

export const authChecker: AuthChecker<IEsmereldaContext> = ({ root, args, context, info }, roles) => {
    if (!context.user) {
        throw new EsmereldaGraphQLError(graphqlErrors.AUTHENTICATION_NOT_AUTHORIZED);
    }

    return true;
};
