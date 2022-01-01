import { connect } from './db';
import { logger } from './utils/logger';
import { getEnvironment } from './utils/env';
import { EsmereldaServer } from './server/EsmereldaServer';

process.on('unhandledRejection', err => {
    logger.error(err);
    process.exit(1);
});

process.on('uncaughtException', err => {
    logger.error(err.message);
    process.exit(1);
});

(async () => {
    const { PORT } = getEnvironment();

    logger.info('Connecting to database...');
    const db = await connect();

    logger.info('Deploying Server...');
    const server = new EsmereldaServer(db);
    await server.listen(PORT);
    logger.info(`Server deployed on port: ${PORT}`);
})();
