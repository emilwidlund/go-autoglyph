import { MINIMUM_USER_NAME_LENGTH, MAXIMUM_USER_NAME_LENGTH } from '../graphql/constants';

export interface IError {
    code: number;
    title: string;
    message: string;
}

export const graphqlErrors = {
    /** Generic Errors */

    GENERIC_INTERNAL_SERVER_ERROR: {
        code: 10000,
        title: 'Internal Server Error',
        message: 'An unexpected error occured'
    },

    /** Authentication Errors */

    AUTHENTICATION_TOKEN_INVALID: {
        code: 20000,
        title: 'Authentication Failed',
        message: 'Authentication token is invalid'
    },
    AUTHENTICATION_TOKEN_EXPIRED: {
        code: 20001,
        title: 'Authentication Failed',
        message: 'Authentication token has expired'
    },
    AUTHENTICATION_REFRESH_TOKEN_INVALID: {
        code: 20002,
        title: 'Authentication Failed',
        message: 'Refresh token is invalid'
    },
    AUTHENTICATION_REFRESH_TOKEN_EXPIRED: {
        code: 20003,
        title: 'Authentication Failed',
        message: 'Refresh token has expired'
    },
    AUTHENTICATION_NOT_AUTHORIZED: {
        code: 20004,
        title: 'Not Authorized',
        message: 'You are not authorized to perform this action'
    },
    AUTHENTICATION_CREDENTIALS_MISMATCH: {
        code: 20005,
        title: 'Authentication Failed',
        message: 'Authentication credentials are invalid'
    },

    /** User Errors */

    USER_NAME_NOT_VALID: {
        code: 30000,
        title: 'Name is invalid',
        message: `Name must be between ${MINIMUM_USER_NAME_LENGTH} and ${MAXIMUM_USER_NAME_LENGTH} characters`
    },
    USER_EMAIL_NOT_VALID: {
        code: 30001,
        title: 'Email is invalid',
        message: 'Provided email address is invalid'
    },
    USER_PASSWORD_NOT_STRONG_ENOUGH: {
        code: 30002,
        title: 'Password is too weak',
        message:
            'Password must have a minimum of eight characters, at least one uppercase letter, one lowercase letter and one number'
    },
    USER_WITH_EMAIL_ALREADY_EXIST: {
        code: 30003,
        title: 'User with email already exist',
        message: 'A user with the provided email already exist'
    },
    USER_WITH_USERNAME_ALREADY_EXIST: {
        code: 30004,
        title: 'User with username already exist',
        message: 'A user with the provided username already exist'
    }
};

/**
 * Builds an error string with code, title & message
 * @param error Error object to extract from
 * @returns A string with code, title & message
 */
export const getErrorString = (error: IError) => {
    return `${error.code} - ${error.title}: ${error.message}`;
};
