import { forwardRef, Module } from '@nestjs/common';
import { UserController } from '../controller/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/model/user.entity';
import { UserService } from 'src/service/user.service';
import { LinkModule } from './link.module';
import { MailerModule } from './mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => LinkModule),
    forwardRef(() => MailerModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
