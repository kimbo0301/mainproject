import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
interface IOAuthUser {
    user: Pick<User, 'email' | 'password' | 'name' | 'age'>;
    // 강제 회원 가입을 위해
}

@Controller()
export class AuthController {
    constructor(
        private readonly userService: UserService, //
        private readonly authService: AuthService,
    ) {}

    @Get('/login/google')
    @UseGuards(AuthGuard('google'))
    async loginGoogle(@Req() req: Request & IOAuthUser, @Res() res: Response) {
        this.aaa(req, res);
    }

    @Get('/login/naver')
    @UseGuards(AuthGuard('naver'))
    async loginNaver(@Req() req: Request & IOAuthUser, @Res() res: Response) {
        this.aaa(req, res);
    }

    @Get('/login/kakao')
    @UseGuards(AuthGuard('kakao'))
    async loginKakao(@Req() req: Request & IOAuthUser, @Res() res: Response) {
        this.aaa(req, res);
    }

    async aaa(req, res) {
        // 1. 가입 확인
        let user = await this.userService.findOne({
            email: req.user.email,
        });

        // 2. 회원가입
        if (!user) {
            user = await this.userService.create({
                email: req.user.email,
                hashedPassword: req.user.password,
                name: req.user.name,
                age: req.user.age,
            });
        }
        // 3. 로그인 refresh 있으면 로그인임
        this.authService.setRefreshToken({ user, res });
        res.redirect(
            'http://localhost:5500/main-project/frontend/login/index.html',
        );
    }
}
