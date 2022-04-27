import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImage } from '../productImage/entities/productImage.entity';
import { ProductInfo } from '../Product_info/entities/productInfo.entitiy';
import { Ranking } from '../ranking/entities/ranking.entity';
import { Product } from './entities/product.entity';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';

@Module({
    //여러개를 동시에 주입할 수 있음
    imports: [
        TypeOrmModule.forFeature([
            Product, //
            ProductImage, //
            Ranking, //
            ProductInfo, //
        ]),
        ElasticsearchModule.register({
            node: 'http://elasticsearch:9200',
        }),
    ],
    providers: [
        // 의존성 주입을 해야함
        // resolver , services들에게
        ProductService,
        ProductResolver,
    ],
})
export class ProductModule {}
