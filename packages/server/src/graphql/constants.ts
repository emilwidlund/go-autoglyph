import { PASSWORD_PATTERN } from '../utils/patterns';

/** Authentication Constants */

/** Value which defines how many seconds JWT Auth tokens should stay valid */
export const JWT_AUTH_TOKEN_EXPIRY = 15 * 60;
/** Value which defines how many seconds JWT Refresh tokens should stay valid */
export const JWT_REFRESH_TOKEN_EXPIRY = 14 * 24 * 60 * 60;

/** User Constants */

export const MINIMUM_USER_NAME_LENGTH = 1;
export const MAXIMUM_USER_NAME_LENGTH = 32;
export const USER_PASSWORD_PATTERN = PASSWORD_PATTERN;
