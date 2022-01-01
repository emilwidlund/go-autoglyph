import * as dotenv from "dotenv";

dotenv.config();

export interface IProcessEnv extends NodeJS.ProcessEnv {
    NODE_ENV: "production" | "staging" | "development";
    POSTGRES_URL: string;
    REDIS_URL: string;
    PORT: string;
    JWT_AUTH_SECRET: string;
    JWT_REFRESH_SECRET: string;
}

export interface IParsedProcessEnv {
    NODE_ENV: "production" | "staging" | "development";
    POSTGRES_URL: string;
    REDIS_URL: string;
    PORT: number;
    JWT_AUTH_SECRET: string;
    JWT_REFRESH_SECRET: string;
}

/** Required Environment Variables */
const requiredEnvironmentVariables: (keyof IProcessEnv)[] = [
    "POSTGRES_URL",
    "REDIS_URL",
    "PORT",
    "JWT_AUTH_SECRET",
    "JWT_REFRESH_SECRET"
];

/** Retrieves & Parses Environment Variables */
export const getEnvironment = (): IParsedProcessEnv => {
    const environment = process.env as IProcessEnv;
    const missingEnvironment = requiredEnvironmentVariables.filter(entry => !(entry in environment));

    if (missingEnvironment.length) {
        throw new Error(`Required environment variables are missing: ${missingEnvironment.join(", ")}`);
    }

    const parsedEnvironment: IParsedProcessEnv = {
        NODE_ENV: environment.NODE_ENV,
        POSTGRES_URL: environment.POSTGRES_URL,
        REDIS_URL: environment.REDIS_URL,
        PORT: Number(environment.PORT),
        JWT_AUTH_SECRET: environment.JWT_AUTH_SECRET,
        JWT_REFRESH_SECRET: environment.JWT_REFRESH_SECRET
    };

    return {
        ...environment,
        ...parsedEnvironment
    };
};
