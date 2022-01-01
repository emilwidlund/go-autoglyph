import {gql} from '@apollo/client';

export const AUTHENTICATION_MUTATION = gql`
    mutation Authenticate($email: String!, $password: String!) {
        authenticate(email: $email, password: $password) {
            token
        }
    }
`;
