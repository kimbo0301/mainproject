import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import {
    UnauthorizedException,
    UnprocessableEntityException,
    UseGuards,
} from '@nestjs/common';
import {
    GqlAuthAccessGuard,
    GqlAuthRefreshGuard,
} from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {}

    @Mutation(() => String)
    async login(
        @Args('email') email: string,
        @Args('password') password: string,
        @Context() context: any,
    ) {
        const user = await this.userService.findOne({ email });

        if (!user)
            throw new UnprocessableEntityException(
                '존재하지 않는 이메일입니다.',
            );

        const isAuthenticated = await bcrypt.compare(password, user.password);
        if (!isAuthenticated)
            throw new UnprocessableEntityException('암호가 일치하지 않습니다.');

        this.authService.setRefreshToken({ user, res: context.res });

        return this.authService.getAccessToken({ user });
    }

    @Mutation(() => String)
    async logout(
        @Context() context: any, //
    ) {
        const accessToken = context.req.headers.authentication.substring(7);
        const refreshToken = context.req.headers.cookie.substring(13);
        try {
            const resultA = jwt.verify(accessToken, 'myAccessKey');
            const resultR = jwt.verify(refreshToken, 'myRefreshKey');

            const resultA1 = Object.values(resultA)[3];
            const resultR1 = Object.values(resultR)[3];

            await this.cacheManager.set(
                `accessToken:${accessToken}`,
                'accessToken',
                {
                    ttl: resultA1,
                },
            );
            await this.cacheManager.set(
                `refreshToken:${refreshToken}`,
                `refreshToken`,
                {
                    ttl: resultR1,
                },
            );

            return '로그아웃에 성공했습니다.';
        } catch (error) {
            throw new UnauthorizedException('인증이 완료되지 않았습니다.');
        }
    }

    @UseGuards(GqlAuthRefreshGuard)
    @Mutation(() => String)
    restoreAccessToken(
        @CurrentUser() currentUser: ICurrentUser,
        @Context() context: ICurrentUser,
    ) {
        return this.authService.getAccessToken({ user: currentUser });
    }
}
