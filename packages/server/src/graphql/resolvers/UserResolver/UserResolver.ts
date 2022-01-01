import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { hash, genSalt } from 'bcrypt';

import { User } from '../../../db/models/User';
import { CreateUserArgs } from './arguments/CreateUserArgs';
import { AuthenticatedEsmereldaContext } from '../../context';
import { graphqlErrors } from '../../../errors';
import { EsmereldaGraphQLError } from '../../error';

@Resolver(of => User)
export class UserResolver {
    @Query(returns => User, { nullable: true })
    async getUser(@Arg('id') id: string): Promise<User | undefined> {
        return User.findOne({ where: { id } });
    }

    @Authorized()
    @Query(returns => User)
    async me(@Ctx() context: AuthenticatedEsmereldaContext): Promise<User> {
        return context.user;
    }

    @Mutation(returns => User)
    async createUser(@Args() { username, email, password }: CreateUserArgs): Promise<User> {
        if (await User.findOne({ where: { email } })) {
            throw new EsmereldaGraphQLError(graphqlErrors.USER_WITH_EMAIL_ALREADY_EXIST);
        }

        if (await User.findOne({ where: { username } })) {
            throw new EsmereldaGraphQLError(graphqlErrors.USER_WITH_USERNAME_ALREADY_EXIST);
        }

        const user = new User();
        user.username = username;
        user.email = email;
        user.passwordHash = await hash(password, await genSalt(10));

        return await user.save();
    }
}
