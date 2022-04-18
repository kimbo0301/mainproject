import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { config } from 'dotenv';
config();
@Injectable()
export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
    constructor() {
        super({
            clientID: process.env.KAKAO_CLIENTID,
            callbackURL: 'http://localhost:3000/login/kakao',
        });
    }

    validate(
        accessToken: string, //
        refreshToken: string,
        profile,
    ) {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
        return {
            email: profile._json.kakao_account.email,
            password: '1111',
            name: profile.displayName,
            age: 0,
        };
    }
}
