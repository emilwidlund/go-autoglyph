import { Connection, createConnection } from 'typeorm';

import { getEnvironment } from '../utils/env';
import { User } from './models/User';

/**
 * Connects to Database
 */
export const connect = async (): Promise<Connection> => {
    const connection = await createConnection({
        type: 'postgres',
        url: getEnvironment().POSTGRES_URL,
        entities: [User]
    });

    await connection.synchronize();

    return connection;
};
