import {
    ManyToMany,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    DeleteDateColumn,
    JoinTable,
    UpdateDateColumn,
} from 'typeorm';
import { Ranking } from 'src/apis/ranking/entities/ranking.entity';
import { ProductImage } from 'src/apis/productImage/entities/productImage.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ProductInfo } from 'src/apis/Product_info/entities/productInfo.entitiy';

@Entity()
@ObjectType()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    @Column()
    @Field(() => String)
    name: string;

    @Column({ default: 0 })
    @Field()
    rank: number;

    @Column()
    @Field(() => Int)
    price: number;

    @Column()
    @Field(() => String)
    description: string;

    @Column({ default: 0 })
    score: number;

    @JoinTable()
    @ManyToMany(() => ProductInfo, (productInfo) => productInfo.product)
    @Field(() => [ProductInfo])
    productInfo: ProductInfo[];

    @ManyToOne(() => Ranking)
    ranking: Ranking;

    @DeleteDateColumn()
    deletedAt?: Date;

    @UpdateDateColumn()
    updatedat: Date;
}
