import { Args, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';

import { User } from '../../../db/models/User';
import { AuthenticateArgs } from './arguments/AuthenticateArgs';
import { IEsmereldaContext, IDecodedRefreshToken } from '../../context';
import { Auth } from './types/Auth';
import { JWT_AUTH_TOKEN_EXPIRY, JWT_REFRESH_TOKEN_EXPIRY } from '../../constants';
import { EsmereldaGraphQLError } from '../../error';
import { graphqlErrors } from '../../../errors';
import { getEnvironment } from '../../../utils/env';

@Resolver(of => Auth)
export class AuthenticationResolver {
    @Mutation(returns => Auth)
    async authenticate(@Args() { email, password }: AuthenticateArgs, @Ctx() ctx: IEsmereldaContext): Promise<Auth> {
        const { JWT_AUTH_SECRET } = getEnvironment();

        const user = await User.authenticate(email, password);

        if (!user) {
            throw new EsmereldaGraphQLError(graphqlErrors.AUTHENTICATION_CREDENTIALS_MISMATCH);
        }

        const token = jwt.sign({ id: user.id }, JWT_AUTH_SECRET, { expiresIn: JWT_AUTH_TOKEN_EXPIRY });

        await this.setRefreshToken(ctx.res, user);

        return {
            token,
            /** Expiry should be milliseconds */
            expiresIn: JWT_AUTH_TOKEN_EXPIRY * 1000
        };
    }

    @Query(returns => Auth)
    async refreshToken(@Ctx() ctx: IEsmereldaContext): Promise<Auth> {
        const { JWT_AUTH_SECRET } = getEnvironment();

        const user = await this.verifyRefreshToken(ctx);

        const token = jwt.sign({ id: user.id }, JWT_AUTH_SECRET, { expiresIn: JWT_AUTH_TOKEN_EXPIRY });

        await this.setRefreshToken(ctx.res, user);

        return {
            token,
            /** Expiry should be milliseconds */
            expiresIn: JWT_AUTH_TOKEN_EXPIRY * 1000
        };
    }

    @Query(returns => Boolean)
    async logout(@Ctx() ctx: IEsmereldaContext): Promise<boolean> {
        await this.clearRefreshToken(ctx.res);

        return true;
    }

    /**
     * Verifies Refresh Token from Request
     * @param ctx Esmerelda Context
     * @returns User
     */
    private async verifyRefreshToken(ctx: IEsmereldaContext): Promise<User> {
        const { JWT_REFRESH_SECRET } = getEnvironment();
        const refreshToken: string = ctx.req.cookies['refreshToken'] || '';

        let payload: IDecodedRefreshToken;

        try {
            payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as IDecodedRefreshToken;
        } catch (err) {
            switch (true) {
                case err instanceof jwt.TokenExpiredError:
                    throw new EsmereldaGraphQLError(graphqlErrors.AUTHENTICATION_REFRESH_TOKEN_EXPIRED);
                default:
                    throw new EsmereldaGraphQLError(graphqlErrors.AUTHENTICATION_REFRESH_TOKEN_INVALID);
            }
        }

        const user = await User.findOne({ where: { id: payload.id }, select: ['id', 'refreshToken'] });

        if (!user || refreshToken !== user.refreshToken) {
            throw new EsmereldaGraphQLError(graphqlErrors.AUTHENTICATION_REFRESH_TOKEN_INVALID);
        }

        return user;
    }

    /**
     * Sets a refreshToken on an outgoing Response
     * @param res Outgoing Express Response
     * @param refreshToken Refresh Token to attach
     */
    private async setRefreshToken(res: Response, user: User): Promise<void> {
        const { JWT_REFRESH_SECRET } = getEnvironment();

        const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, {
            expiresIn: JWT_REFRESH_TOKEN_EXPIRY
        });

        await User.update({ id: user.id }, { refreshToken });

        res.cookie('refreshToken', refreshToken, {
            secure: true,
            /** Max Age should be defined in milliseconds */
            maxAge: JWT_REFRESH_TOKEN_EXPIRY * 1000,
            httpOnly: true,
            sameSite: 'lax'
        });
    }

    /**
     * Clears Refresh Token from browser
     * @param res Outgoing Express Response
     */
    private async clearRefreshToken(res: Response): Promise<void> {
        res.clearCookie('refreshToken');
    }
}
