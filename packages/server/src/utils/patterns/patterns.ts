/**
 * Password pattern which translates to:
 * Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
 */
export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
