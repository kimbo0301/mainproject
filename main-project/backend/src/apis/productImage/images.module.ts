import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImage } from './entities/productImage.entity';
import { ImagesResolver } from './images.resolver';
import { ImagesService } from './images.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProductImage])],
    providers: [
        ImagesResolver, //
        ImagesService,
    ],
})
export class ImagesModule {}
