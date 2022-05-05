# Refresh Token 개념

- 로그인 요청을 하고 나서, 서버에서 토큰을 프론트에게 넘겨줄 때 토큰을 하나 더 만들어서 넘겨줌
- 하나 더 만든 토큰을 refresh token이라 하고, 기존에 발행하던 토큰을 access token이라고 함
- refresh token은 access token이 만료되었을 때, access token을 다시 발행하기 위한 용도로 쓸것이기 때문에 access torken보다 유효기간이 길어야함

> Refresh Token이 필요한 이유

    Access Token(JWT)를 통한 인증 방식의 문제는 해킹을 당했을 경우 보안의 취약
    유효기간이 짧다면 로그인을 자주해서 새롭게 토큰 발급 받아야하므로 불편하고,
    유효기간을 늘린다면 토큰을 해킹당했을 때 보안에 더 취약
    이러한 점들을 보완하는 것이 Refresh Token

- refresh token은 access token과 같은 형태의 JWT
  refresh token은 처음에 로그인을 완료 했을 때 access token과 동시에 발급됨 access token보다 긴 유효기간을 가지면서 accesstoken이 만료되었을 때 새로 발급해 주는 열쇠가 됨

- access token이 해킹 당하면 정보가 유출됨 하지만 유효기간을 짧게 해두면 그 기간 안에서만 사용이 가능하기 때문에 더 안전함

- refresh token의 유효기간이 만료되면, 사용자는 새로 로그인 해야함 refresh token도 해킹될 가능성이 있기 때문에 적절한 유효기간 설정이 필요

# Refresh token의 도식화

![alt refresh token](/images/refreshtoken.png)

1. 사용자가 로그인
2. 서버에서 사용자가 입력한 id, pw를 회원 DB에서 값을 비교
3. 로그인이 완료되면 Access token, Refresh Token을 발급
4. 만료된 토큰이 있는 쿠키와 함께 요청을 보냄
5. 서버가 토큰이 만료되었음을 확인하고 에러 반환
6. 토크이 만료되었음을 확인하고 토큰 재발급 요청을 반료된 토큰과 쿠키와 함께 요청을 보냄
7. 쿠키에 refreshToken을 확인해 토큰을 재발급해서 반환
8. 재발급된 토큰과 쿠키를 이전에 실패한 요청에 재요청을 보냄
9. 정상적으로 요청에 대한 값을 반환

> Access token 만료가 될 때 마다 계속 과정 4~7 과정을 거칠 필요가 없음 front에서 Access token의 payload를 통해 유효기간을 알 수 있으며, 프론트단에서 API 요청 전에 토큰이 만료 됐다면 바로 재발급 요청을 할 수도 있음

# refresh Token Example

```typescript
//context.ts

import { UnauthorizedException } from "@nestjs/common";
import { Request, Response } from "express";

export interface IContext {
  req: Request;
  res: Response;
}
```

```typescript
//auth.service.ts

import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  getAccessToken({ user }) {
    const accessToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: "myAccesskey", expiresIn: "1h" }
    );
    return accessToken;
  }
  // setRefreshToken 추가
  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: "myRefreshkey", expiresIn: "2w" }
    );
    res.setHeader("Set-Cookie", `refreshToken=${refreshToken}`);
  }
}
```

- refreshToken의 expire 시간은 accessToken의 expire 시간 보다 길어야함

- setHeader는 refreshToken을 헤더에 추가함

```typescript
//auth.resolver.ts

import { UnauthorizedException } from "@nestjs/common";
import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { IContext } from "src/common/types/context";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";
import * as bcrypt from "bcrypt";

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Mutation(() => String)
  async login(
    @Args("email") email: string, //
    @Args("password") password: string,
    @Context() context: IContext
  ) {
    const user = await this.userService.findOne({ email });
    const isAuthenticated = await bcrypt.compare(password, user.password);
    if (!isAuthenticated) throw new UnauthorizedException();

    this.authService.setRefreshToken({ user, res: context.res });
    const accessToken = this.authService.getAccessToken({ user });
    return accessToken;
  }
}
```

- 위에서 만들어 놓은 context.ts에 미리 정해놓은 Request와 Response의 타입을 가져와 사용

- context의 res를 사용해 setRefreshToken 비즈니스 로직을 실행 , 쿠키에 refreshToken을 넣어줌

```typescript
// app.module.ts
@Module({
  imports: [
    AuthModule,
    BoardModule,
    ProductModule,
    ProductCategoryModule,
    UserModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
	//이렇게 해야 리졸버에 컨텍스트에 접근이 가능해짐
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
				...
```

- context를 사용하기 위해서는 app.module.ts에 context를 추가해주어야 함

> playground에서 로그인을 하면
> ![alt refreshtoken](/images/loginprocess.png)

- [# Refresh Token 개념](#refresh-token-개념)

- [# Refresh token의 도식화](#Refresh-token의-도식화)

- [# refresh Token Example](#-refresh-Token-Example)
