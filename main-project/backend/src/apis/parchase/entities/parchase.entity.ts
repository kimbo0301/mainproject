import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Parchase {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    @Column()
    @Field(() => Int)
    price: number;

    @Column()
    @Field(() => Int)
    count: number;

    @Column()
    @Field(() => Date)
    dateAt: Date;

    @ManyToOne(() => User)
    @Field(() => User)
    user: User;
}
