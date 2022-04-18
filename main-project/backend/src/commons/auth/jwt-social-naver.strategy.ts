import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { config } from 'dotenv';
config();
@Injectable()
export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
    constructor() {
        super({
            clientID: process.env.NAVER_CLIENTID,
            clientSecret: process.env.NAVER_CLIENTSECRET,
            callbackURL: 'http://localhost:3000/login/naver',
        });
    }

    validate(
        accessToken: string, //
        refreshToken: string,
        profile: any,
    ) {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
        return {
            email: profile._json.email,
            password: '1111',
            name: profile._json.nickname,
            age: 0,
        };
    }
}
