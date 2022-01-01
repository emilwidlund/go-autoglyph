import * as express from 'express';
import { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { Server, ServerOptions } from 'https';
import { buildSchema } from 'type-graphql';
import { Connection } from 'typeorm';
import * as Redis from 'ioredis';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import * as path from 'path';

import { createContext } from '../../graphql/context';
import { AuthenticationResolver } from '../../graphql/resolvers/AuthenticationResolver';
import { UserResolver } from '../../graphql/resolvers/UserResolver';
import { authChecker } from '../../graphql/auth';
import { errorFormatter } from '../../graphql/error';
import { getEnvironment } from '../../utils/env';

export class EsmereldaServer {
    /** Associated HTTPS Server */
    httpsServer: Server;
    /** Associated Express instance */
    app: Application;
    /** Associated Apollo instance */
    apollo: ApolloServer;
    /** Associated Database */
    db: Connection;

    constructor(db: Connection) {
        /** Database Connection */
        this.db = db;

        /** Express Application */
        this.app = this.createExpressApplication();

        /** Pass Express application as HTTPS RequestHandler */
        this.httpsServer = new Server(this.createHTTPSConfig(), this.app);

        this.setupGraphQL(db);
    }

    /** Setup GraphQL */
    private async setupGraphQL(db: Connection) {
        /** Create Redis PubSub engine */
        const pubSub = new RedisPubSub({
            publisher: new Redis(getEnvironment().REDIS_URL),
            subscriber: new Redis(getEnvironment().REDIS_URL)
        });

        /** Build Schema from GraphQL resolvers */
        const schema = await buildSchema({
            resolvers: [AuthenticationResolver, UserResolver],
            pubSub,
            authChecker
        });

        /** Construct Apollo Server */
        this.apollo = new ApolloServer({
            schema,
            context: await createContext(db),
            subscriptions: {
                path: '/subscriptions'
            },
            formatError: errorFormatter
        });

        /** Register Apollo server in Express application */
        this.apollo.applyMiddleware({
            app: this.app,
            cors: {
                origin: ['https://localhost:3000'],
                credentials: true
            }
        });
        this.apollo.installSubscriptionHandlers(this.httpsServer);
    }

    /** Creates Express Application */
    private createExpressApplication(): Application {
        const app = express();

        app.use(cookieParser());

        return app;
    }

    /** Configures HTTPS Server */
    private createHTTPSConfig(): ServerOptions {
        return {
            key: fs.readFileSync(path.resolve(__dirname, '../../ssl/localhost.key'), 'utf-8'),
            cert: fs.readFileSync(path.resolve(__dirname, '../../ssl/localhost.crt'), 'utf-8')
        };
    }

    /** Starts Server on given port */
    public listen(port: number): Promise<void> {
        return new Promise(resolve => {
            this.httpsServer.listen(port, resolve);
        });
    }
}
