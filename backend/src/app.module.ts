import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {  getDataSourceOptions } from 'db/data-source';
import { UserModule } from './module/user.module';
import { GoogleAuthModule } from './google-auth/google-auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes ConfigModule globally available
    }),
    TypeOrmModule.forRoot(getDataSourceOptions()),
    UserModule,
    GoogleAuthModule 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
