import { forwardRef, Module } from '@nestjs/common';
import { MailerService } from '../service/mailer.service';
import { UserModule } from './user.module';

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
