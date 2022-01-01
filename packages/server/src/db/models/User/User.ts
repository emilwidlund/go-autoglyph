import { ObjectType, Field, ID } from 'type-graphql';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { compare } from 'bcrypt';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
    /** Unique Identifier */
    @Field(type => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /** User Name */
    @Field()
    @Column()
    username: string;

    /** Associated Email */
    @Column({ unique: true, select: false })
    email: string;

    /** Encrypted Password Hash */
    @Column({ select: false })
    passwordHash: string;

    /** Refresh Token */
    @Column({ nullable: true, select: false })
    refreshToken?: string;

    /** User Avatar */
    @Field({ nullable: true })
    @Column({ nullable: true })
    avatarUrl?: string;

    /** Creation Date */
    @Field()
    @CreateDateColumn()
    createdAt: Date;

    /** Updated Date */
    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

    /** Compares email and password credentials against entries */
    public static async authenticate(email: string, password: string): Promise<User | undefined> {
        const userWithEmail = await this.createQueryBuilder('user')
            .addSelect('user.passwordHash')
            .where({ email })
            .getOne();
        const matchingPassword = userWithEmail && (await compare(password, userWithEmail.passwordHash));

        return matchingPassword ? userWithEmail : undefined;
    }
}
