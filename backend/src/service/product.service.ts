import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../model/product.entity';
import { CreateProductDto } from '../dto/product/create-product.dto';
import { UpdateProductDto } from '../dto/product/update-product.dto';

import { TagService } from './tag.service';
import { VariantService } from './variant.service';
import { ImageService } from './image.service';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly tagService: TagService,
    private readonly variantService: VariantService,
    private readonly imageService: ImageService,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    try {
      this.logger.log(`Creating product: ${createProductDto.name}`);
      const product = this.productRepository.create({
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        category: { id: createProductDto.categoryId }, // Assuming categoryId is passed in DTO
        image_url: createProductDto.imageUrl,
      });
      const savedProduct = await this.productRepository.save(product);
      if (createProductDto.tags && createProductDto.tags.length) {
        await this.tagService.createTags(savedProduct.id,createProductDto.tags);
      }
      if (createProductDto.variants && createProductDto.variants.length) {
        await this.variantService.createVariants(savedProduct.id,createProductDto.variants);
      }
      if (createProductDto.images && createProductDto.images.length) {
        await this.imageService.createImages(savedProduct.id,createProductDto.images);
      }
      return savedProduct;
    } catch (error) {
      this.logger.error(`Failed to create product: ${error.message}`);
      throw new InternalServerErrorException('Failed to create product');
    }
  }

  async updateProduct(id: number,updateProductDto: UpdateProductDto,): Promise<Product> {
    try {
      this.logger.log(`Updating product ID: ${id}`);
      const product = await this.productRepository.findOne({ where: { id } });
      if (!product) {
        throw new Error(`Product not found`);
      }
      Object.assign(product, updateProductDto);
      await this.productRepository.save(product);
      if (updateProductDto.tags) {
        await this.tagService.updateTags(id, updateProductDto.tags);
      }
      if (updateProductDto.variants) {
        await this.variantService.updateVariants(id, updateProductDto.variants);
      }
      if (updateProductDto.images) {
        await this.imageService.updateImages(id, updateProductDto.images);
      }
      return product;
    } catch (error) {
      this.logger.error(`Failed to update product: ${error.message}`);
      throw new InternalServerErrorException('Failed to update product');
    }
  }

  async findProductById(id: number): Promise<Product> {
    try {
      this.logger.log(`Fetching product with ID: ${id}`);
      const product = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.tags', 'tags') // Join tags
        .leftJoinAndSelect('product.variants', 'variants') // Join variants
        .leftJoinAndSelect('product.images', 'images') // Join images
        .where('product.id = :id', { id })
        .getOne();

      if (!product) {
        this.logger.error(`Product with ID: ${id} not found`);
        return null;
      }
      this.logger.log(`Successfully fetched product with ID: ${id}`);
      return product;
    } catch (error) {this.logger.error(`Error fetching product with ID: ${id} - ${error.message}`,);
      throw new InternalServerErrorException('Error fetching product');
    }
  }

  // Get all products with relations (tags, variants, images)
  async getAllProducts(): Promise<Product[]> {
    try {
      this.logger.log('Fetching all products');
      const products = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.tags', 'tags') // Join tags
        .leftJoinAndSelect('product.variants', 'variants') // Join variants
        .leftJoinAndSelect('product.images', 'images') // Join images
        .getMany();
      this.logger.log(`Successfully fetched ${products.length} products`);
      return products;
    } catch (error) {
      this.logger.error(`Error fetching products - ${error.message}`);
      throw new InternalServerErrorException('Error fetching products');
    }
  }

  async deleteProduct(id: number): Promise<void> {
    try {
      this.logger.log(`Deleting product ID: ${id}`);
      await this.tagService.deleteTagsByProduct(id);
      await this.variantService.deleteVariantsByProduct(id);
      await this.imageService.deleteImagesByProduct(id);
      await this.productRepository.softDelete(id);
    } catch (error) {
      this.logger.error(`Failed to delete product: ${error.message}`);
      throw new InternalServerErrorException('Failed to delete product');
    }
  }
}
