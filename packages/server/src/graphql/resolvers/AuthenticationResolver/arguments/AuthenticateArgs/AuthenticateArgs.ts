import { IsEmail } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';

import { getErrorString, graphqlErrors } from '../../../../../errors';

@ArgsType()
export class AuthenticateArgs {
    @IsEmail({}, { message: getErrorString(graphqlErrors.USER_EMAIL_NOT_VALID) })
    @Field()
    email: string;

    @Field()
    password: string;
}
