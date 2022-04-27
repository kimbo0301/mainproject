import { Field, InputType, Int } from '@nestjs/graphql';
import { ProductImage } from 'src/apis/productImage/entities/productImage.entity';

@InputType()
export class CreateProductInput {
    @Field(() => String)
    name: string;

    @Field(() => Int)
    price: number;

    @Field(() => Int)
    rank: number;

    @Field(() => String)
    rankId: string;

    @Field(() => String)
    description: string;

    @Field(() => [String])
    productInfo: string[];
}
