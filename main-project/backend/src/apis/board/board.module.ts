import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { BoardResolver } from './board.resolver';
import { BoardService } from './board.service';

@Module({
    //여러개를 동시에 주입할 수 있음
    imports: [TypeOrmModule.forFeature([Board])],
    providers: [
        // 의존성 주입을 해야함
        // resolver , services들에게
        BoardService,
        BoardResolver,
    ],
})
export class BoardModule {}
