import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagService } from 'src/service/tag.service';
import { ProductTag } from 'src/model/product_tags.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductTag])],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
