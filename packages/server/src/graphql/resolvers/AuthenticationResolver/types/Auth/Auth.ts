import { Field, ObjectType } from 'type-graphql';
@ObjectType()
export class Auth {
    /** Authentication Token */
    @Field()
    token: string;

    /** Token Expiry in milliseconds */
    @Field()
    expiresIn: number;
}
