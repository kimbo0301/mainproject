import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamPortService } from '../iamport/iamport.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { Transaction } from './entities/Transaction.entity';
import { TransactionResolver } from './Transaction.resolver';
import { TransactionService } from './Transaction.service';
@Module({
    imports: [
        TypeOrmModule.forFeature([
            Transaction, //
            User,
        ]),
    ],
    providers: [
        TransactionResolver, //
        TransactionService,
        IamPortService,
        UserService,
    ],
})
export class TransactionModule {}
