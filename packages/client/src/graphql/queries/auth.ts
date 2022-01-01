import {gql} from '@apollo/client';

export const ME_QUERY = gql`
    query me {
        me {
            id
            username
            avatarUrl
        }
    }
`;

export const REFRESH_TOKEN_QUERY = gql`
    query refreshToken {
        refreshToken {
            token
            expiresIn
        }
    }
`;

export const LOGOUT_QUERY = gql`
    query logout {
        logout
    }
`;
