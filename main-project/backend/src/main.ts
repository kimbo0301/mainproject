import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(graphqlUploadExpress({})); // 파일 업로드 적용
    await app.listen(3000);
}
bootstrap();
