import {
    ConflictException,
    Injectable,
    UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import {
    Transaction,
    TRANSACTION_STATUS_ENUM,
} from './entities/Transaction.entity';
@Injectable({})
export class TransactionService {
    constructor(
        @InjectRepository(Transaction)
        private readonly TransactionRepository: Repository<Transaction>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly connection: Connection, // queryrunner을 쓰기 위해 데이터 주입 및 임포트
    ) {}

    async checkDuplicate({ impUid }) {
        const result = await this.TransactionRepository.findOne({ impUid });
        if (result) throw new ConflictException('이미 결제된 아이디입니다.');
    }

    async checkAlreadyCanceled({ impUid }) {
        const Transaction = await this.TransactionRepository.findOne({
            impUid,
            status: TRANSACTION_STATUS_ENUM.CANCEL,
        });

        if (Transaction)
            throw new UnprocessableEntityException(
                '이미 취소된 결제 ID입니다.',
            );
    }

    async cancel({ impUid, amount, currentUser }) {
        const Transaction = await this.create({
            impUid,
            amount: -amount,
            currentUser,
            status: TRANSACTION_STATUS_ENUM.CANCEL,
        }); //create 재활용
        return Transaction;
    }

    async create({
        impUid,
        amount,
        currentUser,
        status = TRANSACTION_STATUS_ENUM.PAYMENT,
    }) {
        const queryRunner = await this.connection.createQueryRunner();
        await queryRunner.connect();

        // transaction 시작
        await queryRunner.startTransaction('SERIALIZABLE');
        try {
            const Transaction = await this.TransactionRepository.save({
                impUid: impUid,
                amount: amount,
                user: currentUser,
                status,
            });

            await queryRunner.commitTransaction();

            return await queryRunner.manager.save(Transaction);
        } catch (error) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }
}
