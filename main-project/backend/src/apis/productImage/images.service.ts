import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { resourceLimits } from 'worker_threads';
import { ProductImage } from './entities/productImage.entity';

@Injectable()
export class ImagesService {
    constructor(
        @InjectRepository(ProductImage)
        private readonly ProductImagesRepository: Repository<ProductImage>,
    ) {}

    async create({ productid, src }) {
        // 카테고리를 데이터베이스에 저장
        for (let i = 0; i < src.length; i++) {
            const result = await this.ProductImagesRepository.save({
                product: productid,
                src: src[i],
            });
            console.log(result);
            return result;
        }
    }

    async findOne({ productid }) {
        return await this.ProductImagesRepository.findOne({
            where: { product: productid },
        });
    }

    async update({ productid, src }) {
        await this.ProductImagesRepository.delete({
            product: {
                id: productid,
            },
        });

        for (let i = 0; i < src.length; i++) {
            await this.ProductImagesRepository.save({
                product: {
                    id: productid,
                },
                src: src[i],
            });
        }

        return true;
    }
}
