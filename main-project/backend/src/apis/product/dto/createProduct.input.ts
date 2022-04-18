import { Field, InputType, Int } from '@nestjs/graphql';
import { ProductImageInput } from 'src/apis/productImage/dto/productImage.input';

@InputType()
export class CreateProductInput {
    @Field(() => String)
    name: string;

    @Field(() => Int)
    price: number;

    @Field(() => Int)
    rank: number;

    @Field(() => ProductImageInput)
    productImage: ProductImageInput;

    @Field(() => String)
    rankId: string;

    @Field(() => [String])
    productInfo: string[];
}
