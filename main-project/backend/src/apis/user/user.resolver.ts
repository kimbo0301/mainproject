import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser } from 'src/commons/auth/gql-user.param';
import { User } from './entities/user.entity';

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => [User])
    fetchUsers() {
        return this.userService.findAll();
    }

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => String)
    fetchUser(
        @Args('email') email: string,
        @CurrentUser()
        currentUser: any,
    ) {
        return this.userService.findOne({ email: currentUser.email });
    }

    @Mutation(() => User)
    async createUser(
        @Args('email') email: string,
        @Args('password') password: string,
        @Args('name') name: string,
        @Args('age') age: number,
    ) {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        return this.userService.create({ email, hashedPassword, name, age });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Boolean)
    async deleteUser(
        @CurrentUser()
        currentUser: any,
    ) {
        return this.userService.delete({ currentUser });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => User)
    async updateUser(
        @Args('password') password: string,
        @CurrentUser()
        currentUser: any,
    ) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return await this.userService.update({
            currentUser,
            hashedPassword,
        });
    }
}
