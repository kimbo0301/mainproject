import { Field, ObjectType } from '@nestjs/graphql';
import { Category } from 'src/apis/category/entities/product.entity';
import { User } from 'src/apis/user/entities/user.entity';
import { ManyToOne, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Board {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    @Column()
    @Field(() => String)
    title: string;

    @Column()
    @Field(() => String)
    content: string;

    @Column()
    @Field(() => String)
    date: Date;

    @ManyToOne(() => User)
    @Field(() => User)
    user: User;

    @ManyToOne(() => Category)
    @Field(() => Category)
    category: Category;
}
