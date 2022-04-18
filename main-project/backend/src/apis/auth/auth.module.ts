import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshStrategy } from 'src/commons/auth/jwt-refresh.strategy';
import { AuthController } from './auth.controller';
import { JwtGoogleStrategy } from 'src/commons/auth/jwt-social-google.strategy';
import { JwtNaverStrategy } from 'src/commons/auth/jwt-social-naver.strategy';
import { JwtKakaoStrategy } from 'src/commons/auth/jwt-social-kakao.strategy';
@Module({
    imports: [
        JwtModule.register({}), //
        TypeOrmModule.forFeature([User]),
    ],
    providers: [
        AuthResolver, //
        AuthService,
        UserService,
        JwtRefreshStrategy,
        JwtGoogleStrategy,
        JwtNaverStrategy,
        JwtKakaoStrategy,
    ],
    controllers: [AuthController],
})
export class AuthModule {}
