import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {
        super({
            jwtFromRequest: (req) => {
                console.log(req.headers);

                return req.headers.cookie.replace('refreshToken=', '');
            },
            secretOrKey: 'myRefreshKey',
            passReqToCallback: true,
        });
    }

    async validate(req, payload) {
        const resultR = req.headers.cookie.substring(13);
        const a = await this.cacheManager.get(`accessToken:${resultR}`);
        if (a) {
            throw new UnauthorizedException('인증 실패');
        }

        return {
            id: payload.sub,
            email: payload.email,
        };
    }
}
