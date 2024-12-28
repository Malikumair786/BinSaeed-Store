import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDataSourceOptions } from 'db/data-source';
import { UserModule } from './module/user.module';
import { LinkModule } from './module/link.module';
import { MailerModule } from './module/mailer.module';
import { AuthModule } from './module/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes ConfigModule globally available
    }),
    TypeOrmModule.forRoot(getDataSourceOptions()),
    UserModule,
    LinkModule,
    MailerModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
