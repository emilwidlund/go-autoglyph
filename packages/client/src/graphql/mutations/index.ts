export interface IAuthenticateMutationResults {
    authenticate: {
        token: string;
        expiresIn: number;
    };
}
