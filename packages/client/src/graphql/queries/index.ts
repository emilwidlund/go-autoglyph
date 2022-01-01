export interface IGetUserQueryResults {
    getUser: {
        id: string;
        username: string;
        avatarUrl: string;
    };
}

export interface ILogoutQueryResults {
    logout: boolean;
}

export interface IMeQueryResults {
    me: {
        id: string;
        username: string;
        avatarUrl: string;
    };
}

export interface IRefreshTokenQueryResults {
    refreshToken: {
        token: string;
        expiresIn: number;
    };
}
