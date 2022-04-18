import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ranking } from './entities/ranking.entity';
import { RankResolver } from './ranking.resolver';
import { RankService } from './ranking.service';

@Module({
    imports: [TypeOrmModule.forFeature([Ranking])],
    providers: [
        RankResolver, //
        RankService,
    ],
})
export class RankModule {}
