import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findAll() {
        return await this.userRepository.find();
    }

    async findOne({ email }) {
        return await this.userRepository.findOne({ where: { email } });
    }

    async create({ email, hashedPassword: password, name, age }) {
        const user = await this.userRepository.findOne({
            where: { email },
        });
        if (user) throw new ConflictException('이미 등록된 이메일 입니다');
        return await this.userRepository.save({
            email,
            password,
            name,
            age,
        });
    }

    async delete({ currentUser }) {
        const result = await this.userRepository.softDelete({
            id: currentUser.id,
        }); // 다양한 조건으로 삭제 가능!!
        return result.affected ? true : false;
    }
    async update({ currentUser, hashedPassword }) {
        const user = await this.userRepository.findOne({
            where: { id: currentUser.id },
        });

        const newUser = {
            ...user,
            password: hashedPassword,
        };

        return await this.userRepository.save(newUser);
    }
}
