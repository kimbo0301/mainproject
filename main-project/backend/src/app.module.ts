import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ProductModule } from './apis/product/product.module';
import { BoardModule } from './apis/board/board.module';
import { RankModule } from './apis/ranking/ranking.module';
import { UserModule } from './apis/user/user.module';
import { AuthModule } from './apis/auth/auth.module';
import { TransactionModule } from './apis/Transaction/Transaction.module';
import { FileModule } from './apis/file/file.module';
import { ImagesModule } from './apis/productImage/images.module';
import { ConfigModule } from '@nestjs/config';
@Module({
    imports: [
        ProductModule,
        BoardModule,
        RankModule,
        UserModule,
        AuthModule,
        FileModule,
        ImagesModule,
        TransactionModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: 'src/commons/graphql/schema.gql',
            context: ({ req, res }) => ({ req, res }),
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'my-database', //my-database //localhost
            port: 3306,
            username: 'root',
            password: '0000',
            database: 'mydocker02', // mydocker02 // myproject02
            entities: [__dirname + '/apis/**'],
            //시작 위치에 가서 apis로 가고 ** 폴더안의 폴더 모든 곳 샅샅이 뒤짐
            // entity포함된 파일 전부 뒤짐
            synchronize: true,
            logging: true,
            retryAttempts: 20,
        }),

        ConfigModule.forRoot({
            isGlobal: true,
        }),
    ],
    // controllers: [AppController],
    // providers: [AppService],
})
export class AppModule {}
