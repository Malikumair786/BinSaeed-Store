import {Body, Controller, Delete, Get, HttpStatus, Logger, Param, Post, Put, Res, UploadedFiles, UseInterceptors} from '@nestjs/common';
import { Response } from 'express';
import { ProductService } from '../service/product.service';
import { CreateProductDto } from 'src/dto/product/create-product.dto';
import { UpdateProductDto } from 'src/dto/product/update-product.dto';
import { ApiResponse } from '../common/api-response';
import { ResponseCodes } from '../common/response-codes.enum';
import { UserRoles } from '../decorators/roles.decorators';
import { UserType } from 'src/common/user-type.enum';
import { CategoryService } from 'src/service/category.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
  ) {}
  private logger = new Logger(ProductController.name);

  @Post()
  @UserRoles(UserType.ADMIN)
  @UseInterceptors(FilesInterceptor('images'))
  @ApiBearerAuth('access-token')
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res: Response,
  ) {
    try {
      this.logger.log(`Create product request initiated: ${createProductDto.name}`);
      const category = await this.categoryService.findCategoryById(createProductDto.categoryId);
      if (!category) {
        this.logger.log(`Category with ID ${createProductDto.categoryId} not found.`);
        return res.status(HttpStatus.NOT_FOUND).json(
          new ApiResponse(false, ResponseCodes.GENERIC_NOT_FOUND, 'Category not found', null),
        );
      }
      if (typeof createProductDto.tags === 'string') {
        createProductDto.tags = JSON.parse(createProductDto.tags);
      }
      const product = await this.productService.createProduct(createProductDto, files);
      this.logger.log(`Product created successfully: ${createProductDto.name}`);
      return res.status(HttpStatus.CREATED).json(
        new ApiResponse(true, ResponseCodes.GENERIC_ACCEPTED, 'Product created successfully', product),
      );
    } catch (error) {
      this.logger.error(`Failed to create product: ${createProductDto.name} - ${error.message}`);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
        new ApiResponse(false, ResponseCodes.GENERIC_INTERNAL_SERVER_ERROR, 'Internal server error', null),
      );
    }
  }

  @Post("/images")
  @UserRoles(UserType.ADMIN)
  @UseInterceptors(FilesInterceptor('images'))
  @ApiBearerAuth('access-token')
  async iuploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res: Response,
  ) {
    try {
      this.logger.log(`Uploading Image to S3`);
      const image = await this.productService.uploadImages(files);
      this.logger.log(`image upload successfully: ${image}`);
      return res.status(HttpStatus.CREATED).json(
        new ApiResponse(true, ResponseCodes.GENERIC_ACCEPTED, 'image upload successfully', image),
      );
    } catch (error) {
      this.logger.error(`Failed to upload image:  - ${error.message}`);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
        new ApiResponse(false, ResponseCodes.GENERIC_INTERNAL_SERVER_ERROR, 'Internal server error', null),
      );
    }
  }

  @Get(':id')
  async getProduct(@Param('id') id: number, @Res() res: Response) {
    this.logger.log(`Get product request initiated: ${id}`,);
    try {
      const product = await this.productService.findProductById(id);
      if (!product) {
        this.logger.log(`Product not found with id: ${id}`,);
        return res.status(HttpStatus.NOT_FOUND).json(new ApiResponse(false,ResponseCodes.GENERIC_NOT_FOUND,'Product not found',null))
      }
      return res.status(HttpStatus.OK).json(new ApiResponse(true,ResponseCodes.GENERIC_OK,'Product retrieved successfully',product,),);
    } catch (error) {
      this.logger.error(`Error fetching product: ${id} - ${error}`);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new ApiResponse(false,ResponseCodes.GENERIC_INTERNAL_SERVER_ERROR,'Internal server error',null,),);
    }
  }

  @Get()
  async getAllProducts(@Res() res: Response) {
    try {
      const product = await this.productService.getAllProducts();
      if (!product) {
        this.logger.log("no Product found");
        return res.status(HttpStatus.NOT_FOUND).json(new ApiResponse(false,ResponseCodes.GENERIC_NOT_FOUND,'No product found',null,),);
      }
      return res.status(HttpStatus.OK).json(new ApiResponse(true,ResponseCodes.GENERIC_OK,'Product retrieved successfully',product,),);
    } catch (error) {
      this.logger.error(`Error fetching product: ${error}`);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new ApiResponse(false,ResponseCodes.GENERIC_INTERNAL_SERVER_ERROR,'Internal server error',null,),);
    }
  }

  @Put(':id')
  @UserRoles(UserType.ADMIN)
  async updateProduct(@Param('id') id: number,@Body() updateProductDto: UpdateProductDto,@Res() res: Response,) {
    try {
      const product = await this.productService.findProductById(id);
      if (!product) {
        this.logger.log(`Product not found with id: ${id}`,);
        return res.status(HttpStatus.NOT_FOUND).json(new ApiResponse(false,ResponseCodes.GENERIC_NOT_FOUND,'Product not found',null))
      }
      const updatedProduct = await this.productService.updateProduct(id,updateProductDto,);
      return res.status(HttpStatus.OK).json(new ApiResponse(true,ResponseCodes.GENERIC_OK,'Product updated successfully',updatedProduct));
    } catch (error) {
      this.logger.error(`Error updating product: ${id} - ${error}`);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new ApiResponse(false,ResponseCodes.GENERIC_INTERNAL_SERVER_ERROR,'Internal server error',null));
    }
  }

  @Delete(':id')
  @UserRoles(UserType.ADMIN)
  async deleteProduct(@Param('id') id: number, @Res() res: Response) {
    try {
      const product = await this.productService.findProductById(id);
      if (!product) {
        this.logger.log(`Product not found for id: ${id}`,);
        return res.status(HttpStatus.NOT_FOUND).json(new ApiResponse(false,ResponseCodes.GENERIC_NOT_FOUND,'Product not found',null))
      }
      await this.productService.deleteProduct(id);
      return res.status(HttpStatus.OK).json(new ApiResponse(true,ResponseCodes.GENERIC_OK,'Product deleted successfully',null));
    } catch (error) {
      this.logger.error(`Error deleting product: ${id} - ${error}`);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new ApiResponse(false,ResponseCodes.GENERIC_INTERNAL_SERVER_ERROR,'Internal server error',null,),);
    }
  }
}
