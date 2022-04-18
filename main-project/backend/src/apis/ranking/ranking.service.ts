import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ranking } from './entities/ranking.entity';

@Injectable()
export class RankService {
    constructor(
        @InjectRepository(Ranking)
        private readonly rankRepository: Repository<Ranking>,
    ) {}

    async create({ name }) {
        // 카테고리를 데이터베이스에 저장
        const result = await this.rankRepository.save({ subject: name });
        console.log(result);

        return result;
    }
}
