import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from '../model/links.entity';
import { UserModule } from './user.module';
import { LinkService } from '../service/link.service';

@Module({
  imports: [TypeOrmModule.forFeature([Link]), forwardRef(() => UserModule)],
  controllers: [],
  providers: [LinkService],
  exports: [LinkService],
})
export class LinkModule {}
