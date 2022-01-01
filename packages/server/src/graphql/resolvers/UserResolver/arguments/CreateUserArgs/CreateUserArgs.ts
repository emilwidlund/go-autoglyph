import { ArgsType, Field } from 'type-graphql';
import { IsEmail, Length, Matches } from 'class-validator';

import { getErrorString, graphqlErrors } from '../../../../../errors';
import { MAXIMUM_USER_NAME_LENGTH, MINIMUM_USER_NAME_LENGTH, USER_PASSWORD_PATTERN } from '../../../../constants';

@ArgsType()
export class CreateUserArgs {
    @Length(MINIMUM_USER_NAME_LENGTH, MAXIMUM_USER_NAME_LENGTH, {
        message: getErrorString(graphqlErrors.USER_NAME_NOT_VALID)
    })
    @Field()
    username: string;

    @IsEmail({}, { message: getErrorString(graphqlErrors.USER_EMAIL_NOT_VALID) })
    @Field()
    email: string;

    @Matches(USER_PASSWORD_PATTERN, {
        message: getErrorString(graphqlErrors.USER_PASSWORD_NOT_STRONG_ENOUGH)
    })
    @Field()
    password: string;
}
