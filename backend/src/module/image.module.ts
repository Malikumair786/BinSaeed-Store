import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImage } from 'src/model/product_images.entity';
import { ImageService } from 'src/service/image.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductImage])],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
