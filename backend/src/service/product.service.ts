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
import { VariantService } from './variant.service';
import { S3Service } from './S3Service.service';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly variantService: VariantService,
    private readonly s3Service: S3Service,
  ) {}


  async createProduct(createProductDto: CreateProductDto, files: Express.Multer.File[]): Promise<Product> {
    try {
      this.logger.log(`Creating product: ${createProductDto.name}`);
      let uploadedImageUrls: string[] = [];
      if (files && files.length > 0) {
        uploadedImageUrls = await Promise.all(
          files.map((file) => this.s3Service.uploadFile(file)),
        );
      }

      createProductDto.images = uploadedImageUrls;

      const product = this.productRepository.create({
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        image_url: uploadedImageUrls.length > 0 ? uploadedImageUrls[0] : null,
        category: { id: createProductDto.categoryId },
        tags: createProductDto.tags,
        images: uploadedImageUrls,
      });
      
      const savedProduct = await this.productRepository.save(product);
      this.logger.log(`Product created successfully with ID: ${savedProduct.id}`);
      if (createProductDto.variants && createProductDto.variants.length) {
        await this.variantService.createVariants(savedProduct.id,createProductDto.variants);
      }
      this.logger.log(`Product creation completed successfully: ${savedProduct.name}`);
      return savedProduct;
    } catch (error) {
      this.logger.error(`Failed to create product: ${error.message}`);
      throw new InternalServerErrorException('Failed to create product');
    }
  }

  async uploadImages(files: Express.Multer.File[]){
    try {
      let uploadedImageUrls: string[] = [];
      if (files && files.length > 0) {
        uploadedImageUrls = await Promise.all(
          files.map((file) => this.s3Service.uploadFile(file)),
        );
      }
      this.logger.log(`Images uploaded successfully`);
      return uploadedImageUrls;
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
      if (updateProductDto.variants) {
        await this.variantService.updateVariants(id, updateProductDto.variants);
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
        .leftJoinAndSelect('product.variants', 'variants') // Join variants
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
        .leftJoinAndSelect('product.variants', 'variants') // Join variants
        .leftJoinAndSelect('product.category', 'category')
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
      await this.variantService.deleteVariantsByProduct(id);
      await this.productRepository.softDelete(id);
    } catch (error) {
      this.logger.error(`Failed to delete product: ${error.message}`);
      throw new InternalServerErrorException('Failed to delete product');
    }
  }
}
