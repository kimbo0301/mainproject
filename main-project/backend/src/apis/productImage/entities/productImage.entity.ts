import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/apis/product/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
@ObjectType()
@Entity()
export class ProductImage {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    @Column()
    @Field(() => [String])
    src: string;

    @ManyToOne(() => Product)
    @Field(() => Product)
    product: Product;
}
