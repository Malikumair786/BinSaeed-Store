import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/model/product.entity';
import { ProductService } from 'src/service/product.service';
import { ProductController } from 'src/controller/product.controller';
import { CategoryModule } from './category.module';
import { VariantModule } from './variant.module';
import { S3Module } from './s3Module.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CategoryModule, VariantModule, S3Module],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
