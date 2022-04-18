import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { IamPortService } from '../iamport/iamport.service';
import { UserService } from '../user/user.service';
import {
    Transaction,
    TRANSACTION_STATUS_ENUM,
} from './entities/Transaction.entity';
import { TransactionService } from './Transaction.service';

@Resolver({})
export class TransactionResolver {
    constructor(
        private readonly TransactionService: TransactionService,
        private readonly IamportService: IamPortService,
    ) {}
    @UseGuards(GqlAuthAccessGuard) // cruuentuser 를 사용할 수 있음인증거치면
    @Mutation(() => Transaction)
    async createTransaction(
        @Args('impUid') impUid: string,
        @Args('amount') amount: number,
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        // 검증 로직
        // 1. 아임포트에 요청해서 결제 완료 기록이 존재하는지 확인

        const token = await this.IamportService.getToken();

        await this.IamportService.checkPaid({ impUid, amount, token });

        // 2 .  Transaction 테이블에는 impUid가 1번만 존재해야함 (중복 결제를 체크)
        await this.TransactionService.checkDuplicate({ impUid });

        return await this.TransactionService.create({
            impUid,
            amount,
            currentUser,
        });
    }
    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Transaction)
    async cancelTransaction(
        @Args('impUid') impUid: string,
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        // 검증로직들!
        // 1. 이미 취소된 건인지 확인
        await this.TransactionService.checkAlreadyCanceled({ impUid });

        // 2. 실제로 아임포트에 취소 요청
        const token = await this.IamportService.getToken();
        console.log(token);
        const canceledAmount = await this.IamportService.cancel({
            impUid,
            token,
        });
        // Transaction 테이블에 결제 취소 등록
        return await this.TransactionService.cancel({
            impUid,
            amount: canceledAmount,
            currentUser,
        });
    }
}
