import * as winston from 'winston';

import { getEnvironment } from '../env';

const format = winston.format.printf(({ timestamp, level, message, requestId }) => {
    return [timestamp, requestId ? requestId : undefined, level, message].filter(v => v).join(' - ');
});

const loggingLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        request: 3,
        resolver: 4,
        api: 5,
        debug: 6
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'white',
        request: 'cyan',
        resolver: 'green',
        api: 'blue',
        debug: 'gray'
    }
};

winston.addColors(loggingLevels.colors);

export interface ILogMethods {
    error: winston.LeveledLogMethod;
    warn: winston.LeveledLogMethod;
    info: winston.LeveledLogMethod;
    request: winston.LeveledLogMethod;
    resolver: winston.LeveledLogMethod;
    api: winston.LeveledLogMethod;
    debug: winston.LeveledLogMethod;
}

export type IGatewayLogger = winston.Logger & ILogMethods;

export const logger = winston.createLogger({
    level: 'debug',
    levels: loggingLevels.levels,
    format: winston.format.combine(
        winston.format.timestamp(),
        format
        // winston.format.json()
    )
}) as IGatewayLogger;

if (getEnvironment().NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            format: winston.format.combine(winston.format.timestamp(), winston.format.colorize({ all: true }), format)
        })
    );
}
