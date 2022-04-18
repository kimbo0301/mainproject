import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Ranking } from './entities/ranking.entity';
import { RankService } from './ranking.service';

@Resolver()
export class RankResolver {
    constructor(private readonly rankService: RankService) {}

    @Mutation(() => Ranking)
    createRank(
        @Args('name') name: string, //
    ) {
        return this.rankService.create({ name });
    }
}
