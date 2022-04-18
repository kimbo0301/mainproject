import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CreateBoardInput } from './dto/createBoard.input';
import { Board } from './entities/board.entity';
import { UpdateBoardInput } from './dto/updateBoard.input';
import { BoardService } from './board.service';
@Resolver()
export class BoardResolver {
    //데이터 주입 받기
    constructor(private readonly boardService: BoardService) {}

    @Query(() => [Board])
    fetchBoards() {
        return this.boardService.findAll();
    }

    @Query(() => Board)
    fetchBoard(@Args('boardId') boardId: string) {
        return this.boardService.findOne({ boardId });
    }

    @Mutation(() => Board)
    createBoard(@Args('createBoardInput') createBoardInput: CreateBoardInput) {
        return this.boardService.create({ createBoardInput }); // 받아온 name 넘기기 service로
    }

    @Mutation(() => Board)
    async updateBoard(
        @Args('boardId') boardId: string,

        @Args('updateBoardInput') updateBoardInput: UpdateBoardInput,
    ) {
        // 수정하기
        return await this.boardService.update({
            boardId,
            updateBoardInput,
        });
    }
}
