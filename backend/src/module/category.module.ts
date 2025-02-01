import { Module } from '@nestjs/common';
import { CategoryService } from 'src/service/category.service';
import { CategoryController } from 'src/controller/category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/model/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
