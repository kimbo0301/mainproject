import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImage } from '../productImage/entities/productImage.entity';
import { ProductInfo } from '../Product_info/entities/productInfo.entitiy';
import { Ranking } from '../ranking/entities/ranking.entity';
import { Product } from './entities/product.entity';
@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        @InjectRepository(ProductImage)
        private readonly productImageRepository: Repository<ProductImage>,

        @InjectRepository(Ranking)
        private readonly rankIdRepository: Repository<Ranking>,

        @InjectRepository(ProductInfo)
        private readonly productInfoRepository: Repository<ProductInfo>,
    ) {}
    async findAll() {
        const products = await this.productRepository.find({
            relations: ['ranking', 'productInfo'],
            withDeleted: true,
        });
        return products;
    }

    async findOne({ productId }) {
        const product = await this.productRepository.findOne({
            where: { id: productId },
            withDeleted: true,
            relations: ['productimage', 'ranking', 'productInfo'],
        });
        return product;
    }

    async create({ createProductInput }) {
        const { productInfo, rankId, ...product } = createProductInput;

        const result2 = [];

        for (let i = 0; i < productInfo.length; i++) {
            const prevInfo = await this.productInfoRepository.findOne({
                name: productInfo[i],
            });

            if (prevInfo) {
                result2.push(prevInfo);
            } else {
                const newinfo = await this.productInfoRepository.save({
                    name: productInfo[i],
                });
                result2.push(newinfo);
            }
        }

        return await this.productRepository.save({
            ...product,
            ranking: { id: rankId },
            productInfo: result2,
        });
    }

    //상품수정
    async update({ productId, updateProductInput }) {
        const product = await this.productRepository.findOne({
            where: { id: productId },
        });

        const newProduct = {
            ...product,
            ...updateProductInput,
        };

        return await this.productRepository.save(newProduct);
    }

    async delete({ productId }) {
        const result = await this.productRepository.softDelete({
            id: productId,
        }); // 다양한 조건으로 삭제 가능!!
        return result.affected ? true : false;
    }

    async restoreOne({ productId }) {
        const result = await this.productRepository.restore({ id: productId });
        return result.affected ? true : false;
    }
}
