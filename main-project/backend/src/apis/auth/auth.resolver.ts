import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { GqlAuthRefreshGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    @Mutation(() => String)
    async login(
        @Args('email') email: string,
        @Args('password') password: string,
        @Context() context: any,
    ) {
        const user = await this.userService.findOne({ email });
        console.log(user);

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
    @UseGuards(GqlAuthRefreshGuard)
    @Mutation(() => String)
    restoreAccessToken(
        @CurrentUser() currentUser: ICurrentUser,
        @Context() context: ICurrentUser,
    ) {
        return this.authService.getAccessToken({ user: currentUser });
    }
}
