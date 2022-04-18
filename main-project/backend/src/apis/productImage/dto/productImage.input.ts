import { InputType, OmitType } from '@nestjs/graphql';
import { ProductImage } from '../entities/productImage.entity';

@InputType()
export class ProductImageInput extends OmitType(
    ProductImage,
    ['id'],
    InputType,
) {}
