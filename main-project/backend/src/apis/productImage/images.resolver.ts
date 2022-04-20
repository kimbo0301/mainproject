import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { type } from 'os';
import { ProductImage } from './entities/productImage.entity';
import { ImagesService } from './images.service';

@Resolver()
export class ImagesResolver {
    constructor(private readonly ImagesService: ImagesService) {}

    @Mutation(() => ProductImage)
    findimages(@Args('productid') productid: string) {
        return this.ImagesService.findOne({ productid });
    }

    @Mutation(() => ProductImage)
    createImages(
        @Args('productid')
        productid: string, //
        @Args({ name: 'src', type: () => [String] }) src: string[],
    ) {
        return this.ImagesService.create({ productid, src });
    }

    @Mutation(() => Boolean)
    update(
        @Args('productid')
        productid: string,
        @Args({ name: 'src', type: () => [String] }) src: string[],
    ) {
        return this.ImagesService.update({ productid, src });
    }
}
