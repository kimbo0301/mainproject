import {
    Column,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Parchase } from 'src/apis/parchase/entities/parchase.entity';
import { Board } from 'src/apis/board/entities/board.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
@Entity()
@ObjectType()
export class User {
    @PrimaryGeneratedColumn('uuid')
    //id가 자동으로 붙음
    @Field(() => String)
    id: string;

    @Column()
    @Field(() => String)
    email: string;

    @Column()
    // @Field(() => User)
    password: string;

    @Column()
    @Field(() => String)
    name: string;

    @Column()
    @Field(() => Int)
    age: number;

    @DeleteDateColumn()
    deletedAt?: Date;

    @ManyToOne(() => Parchase)
    @Field(() => Parchase)
    parchase: Parchase;

    @ManyToOne(() => Board)
    @Field(() => Board)
    board: Board;
}
