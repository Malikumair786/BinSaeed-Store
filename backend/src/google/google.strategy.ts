import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.SERVER_URL + '/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: any,
  ): Promise<any> {
    try {
      if (!profile || !profile.emails || !profile.name) {
        throw new Error('Invalid Google profile information');
      }
      const user = {
        email: profile.emails[0]?.value,
        firstName: profile.name?.givenName || '',
        lastName: profile.name?.familyName || '',
        accessToken,
      };
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
