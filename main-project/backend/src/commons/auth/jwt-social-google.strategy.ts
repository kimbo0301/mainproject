import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENTID,
            clientSecret: process.env.GOOGLE_CLIENTSECRET,
            callbackURL: 'http://localhost:3000/login/google',
            scope: ['email', 'profile'],
        });
    }

    validate(accessToken: string, refreshToken: string, profile) {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
        return {
            email: profile.emails[0].value,
            password: '1111',
            name: profile.displayName,
            age: 0,
        };
    }
}
