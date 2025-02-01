import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductTag } from 'src/model/product_tags.entity';
import { CreateProductTagDto } from '../dto/product/create-product-tag.dto';

@Injectable()
export class TagService {
  private readonly logger = new Logger(TagService.name);
  constructor(
    @InjectRepository(ProductTag)
    private readonly tagRepository: Repository<ProductTag>,
  ) {}

  async createTags(productId: number,tags: CreateProductTagDto[],
  ): Promise<void> {
    try {
      this.logger.log(`Creating tags for product ID: ${productId}`);
      const tagEntities = tags.map((tag) =>
        this.tagRepository.create({tag: tag.name, product: { id: productId }}),
      );
      await this.tagRepository.save(tagEntities);
      this.logger.log(`Successfully created ${tags.length} tags for product ID: ${productId}`,);
    } catch (error) {
      this.logger.error(`Failed to create tags for product ID: ${productId} - ${error.message}`,);
      throw new InternalServerErrorException('Failed to create product tags');
    }
  }

  async updateTags(productId: number,tags: CreateProductTagDto[],): Promise<void> {
    try {
      this.logger.log(`Updating tags for product ID: ${productId}`);
      await this.deleteTagsByProduct(productId);
      await this.createTags(productId, tags);
      this.logger.log(`Successfully updated tags for product ID: ${productId}`);
    } catch (error) {
      this.logger.error(`Failed to update tags for product ID: ${productId} - ${error.message}`,);
      throw new InternalServerErrorException('Failed to update product tags');
    }
  }

  async deleteTagsByProduct(productId: number): Promise<void> {
    try {
      this.logger.log(`Deleting tags for product ID: ${productId}`);
      await this.tagRepository.softDelete({ product: { id: productId } });
      this.logger.log(`Successfully deleted tags for product ID: ${productId}`);
    } catch (error) {
      this.logger.error(`Failed to delete tags for product ID: ${productId} - ${error.message}`,);
      throw new InternalServerErrorException('Failed to delete product tags');
    }
  }
}
