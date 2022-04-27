import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CreateProductInput } from './dto/createProduct.input';
import { Product } from './entities/product.entity';
import { UpdateProductInput } from './dto/updateProduct.input';
import { ProductService } from './product.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Resolver()
export class ProductResolver {
    //데이터 주입 받기
    constructor(
        private readonly productService: ProductService,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache, //
        private readonly elasticsearchService: ElasticsearchService,
    ) {}

    @Query(() => [Product])
    async fetchProducts(@Args('search') search: string) {
        const product = await this.cacheManager.get(search);
        if (product) {
            return product;
        } else {
            const result = await this.elasticsearchService.search({
                index: 'product',
                query: {
                    bool: {
                      should:[{ prefix: { name: search } }]
                    }
                  }
            });

            const arr = result['hits']['hits'].map(async (el) => {
                return el._source;
            });

            await this.cacheManager.set(search, arr, { ttl: 230000 });
            return arr;
        }
    }

    @Query(() => Product)
    fetchProduct(@Args('productId') productId: string) {
        return this.productService.findOne({ productId });
    }

    @Mutation(() => Product)
    createProduct(
        @Args('createProductInput') createProductInput: CreateProductInput,
    ) {
        return this.productService.create({ createProductInput }); // 받아온 name 넘기기 service로
    }

    @Mutation(() => Product)
    async updateProduct(
        @Args('productId') productId: string,

        @Args('updateProductInput') updateProductInput: UpdateProductInput,
    ) {
        // 수정하기
        return await this.productService.update({
            productId,
            updateProductInput,
        });
    }

    @Mutation(() => Boolean)
    deleteProduct(@Args('productId') productId: string) {
        return this.productService.delete({ productId });
    }

    @Mutation(() => Boolean)
    restoreOne(@Args('productId') productId: string) {
        return this.productService.restoreOne({ productId });
    }
}
