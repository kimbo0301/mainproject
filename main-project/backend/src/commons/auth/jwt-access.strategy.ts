import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'myAccessKey',
            passReqToCallback: true,
        });
    }

    async validate(req, payload) {
        console.log(req, 'BBBBB');
        const resultA = req.headers.authorization.substring(7);
        const a = await this.cacheManager.get(`accessToken:${resultA}`);
        if (a) {
            throw new UnauthorizedException('인증 실패');
        }

        return {
            id: payload.sub,
            email: payload.email,
        };
    }
}
