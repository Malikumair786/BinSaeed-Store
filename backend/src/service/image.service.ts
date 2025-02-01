import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImage } from 'src/model/product_images.entity';
import { CreateProductImageDto } from '../dto/product/create-product-image.dto';

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);
  constructor(
    @InjectRepository(ProductImage)
    private readonly imageRepository: Repository<ProductImage>,
  ) {}

  async createImages(productId: number,images: CreateProductImageDto[],): Promise<void> {
    try {
      this.logger.log(`Creating ${images.length} images for product ID: ${productId}`,);
      const imageEntities = images.map((image) =>
        this.imageRepository.create({ image_url: image.imageUrl , product: { id: productId } }),
      );
      await this.imageRepository.save(imageEntities);
      this.logger.log(`Successfully created ${images.length} images for product ID: ${productId}`,);
    } catch (error) {
      this.logger.error(`Failed to create images for product ID: ${productId} - ${error.message}`,);
      throw new InternalServerErrorException('Failed to create product images');
    }
  }

  async updateImages(productId: number,images: CreateProductImageDto[],): Promise<void> {
    try {
      this.logger.log(`Updating images for product ID: ${productId}`);
      await this.deleteImagesByProduct(productId);
      await this.createImages(productId, images);
      this.logger.log(
        `Successfully updated images for product ID: ${productId}`,);
    } catch (error) {
      this.logger.error(`Failed to update images for product ID: ${productId} - ${error.message}`,);
      throw new InternalServerErrorException('Failed to update product images');
    }
  }

  async deleteImagesByProduct(productId: number): Promise<void> {
    try {
      this.logger.log(`Deleting images for product ID: ${productId}`);
      await this.imageRepository.softDelete({ product: { id: productId } });
      this.logger.log(`Successfully deleted images for product ID: ${productId}`);
    } catch (error) {
      this.logger.error(`Failed to delete images for product ID: ${productId} - ${error.message}`,);
      throw new InternalServerErrorException('Failed to delete product images');
    }
  }
}
