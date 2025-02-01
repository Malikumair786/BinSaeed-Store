import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariant } from 'src/model/product_Variants.entity';
import { CreateProductVariantDto } from '../dto/product/create-product-variant.dto';

@Injectable()
export class VariantService {
  private readonly logger = new Logger(VariantService.name);

  constructor(
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
  ) {}

  async createVariants(productId: number,variants: CreateProductVariantDto[]): Promise<void> {
    try {
      this.logger.log(`Creating ${variants.length} variants for product ID: ${productId}`);
      const variantEntities = variants.map((variant) =>
        this.variantRepository.create({variant_name: variant.name, price: variant.price, product: { id: productId },})
      );
      await this.variantRepository.save(variantEntities);
      this.logger.log(`Successfully created ${variants.length} variants for product ID: ${productId}`,);
    } catch (error) {
      this.logger.error(`Failed to create variants for product ID: ${productId} - ${error.message}`,);
      throw new InternalServerErrorException('Failed to create product variants',);
    }
  }

  async updateVariants(productId: number,variants: CreateProductVariantDto[],): Promise<void> {
    try {
      this.logger.log(`Updating variants for product ID: ${productId}`);
      await this.deleteVariantsByProduct(productId);
      await this.createVariants(productId, variants);
      this.logger.log(`Successfully updated variants for product ID: ${productId}`,);
    } catch (error) {
      this.logger.error(`Failed to update variants for product ID: ${productId} - ${error.message}`,);
      throw new InternalServerErrorException('Failed to update product variants',);
    }
  }

  async deleteVariantsByProduct(productId: number): Promise<void> {
    try {
      this.logger.log(`Deleting variants for product ID: ${productId}`);
      await this.variantRepository.softDelete({ product: { id: productId } });
      this.logger.log(`Successfully deleted variants for product ID: ${productId}`,);
    } catch (error) {
      this.logger.error(`Failed to delete variants for product ID: ${productId} - ${error.message}`,);
      throw new InternalServerErrorException('Failed to delete product variants',);
    }
  }
}
