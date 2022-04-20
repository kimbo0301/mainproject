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
        const result = await this.ProductImagesRepository.save({
            product: productid,
            src,
        });
        console.log(result);
        return result;
    }

    async findOne({ productid }) {
        return await this.ProductImagesRepository.findOne({
            where: { product: productid },
        });
    }

    async update({ productid, src }) {
        await this.ProductImagesRepository.delete({
            product: productid,
        });
        const result = await this.ProductImagesRepository.save({
            product: productid,
            src,
        });
        return result;
    }
}
