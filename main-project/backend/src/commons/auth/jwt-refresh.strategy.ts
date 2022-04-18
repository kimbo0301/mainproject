import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
    constructor() {
        super({
            jwtFromRequest: (req) => {
                console.log(req.headers);

                return req.headers.cookie.replace('refreshToken=', '');
            },
            secretOrKey: 'myRefreshKey',
        });
    }

    validate(payload) {
        return {
            id: payload.sub,
            email: payload.email,
        };
    }
}
