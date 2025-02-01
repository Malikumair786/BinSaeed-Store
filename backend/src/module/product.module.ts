import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/model/product.entity';
import { ProductService } from 'src/service/product.service';
import { ProductController } from 'src/controller/product.controller';
import { CategoryModule } from './category.module';
import { TagModule } from './tag.module';
import { ImageModule } from './image.module';
import { VariantModule } from './variant.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CategoryModule, TagModule, ImageModule, VariantModule],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
