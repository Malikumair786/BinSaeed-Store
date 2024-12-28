import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { AuthService } from 'src/service/auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from 'src/controller/auth.controller';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesGuard } from 'src/guard/roles.guard';
import { LinkModule } from './link.module';
import { MailerModule } from './mailer.module';
import { GoogleStrategy } from 'src/google/google.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => LinkModule),
    forwardRef(() => MailerModule),
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'JWT_SECRET',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  exports: [AuthService],
  providers: [
    AuthService,
    GoogleStrategy,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AuthModule {}
