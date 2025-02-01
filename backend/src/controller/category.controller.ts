import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../common/api-response';
import { ResponseCodes } from '../common/response-codes.enum';
import { UserType } from 'src/common/user-type.enum';
import { UserRoles } from '../decorators/roles.decorators';
import { createCategoryDto } from 'src/dto/category/create-category.dto';
import { UpdateCategoryDto } from 'src/dto/category/update-category.dto';
import { CategoryService } from '../service/category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  private logger = new Logger(CategoryController.name);

  @Post()
  @UserRoles(UserType.ADMIN)
  async createCategory(
    @Body() createCategoryDto: createCategoryDto,
    @Res() res: Response,
  ) {
    this.logger.log(
      `Create category request initiated for title: ${createCategoryDto.title}`,
    );
    try {
      const category =
        await this.categoryService.createCategory(createCategoryDto);
      this.logger.log(
        `Category created successfully: ${createCategoryDto.title}`,
      );
      return res
        .status(HttpStatus.CREATED)
        .json(
          new ApiResponse(
            true,
            ResponseCodes.GENERIC_ACCEPTED,
            'Category created successfully',
            category,
          ),
        );
    } catch (error) {
      this.logger.error(
        `Failed to create category: ${createCategoryDto.title} - ${error}`,
      );
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ApiResponse(
            false,
            ResponseCodes.GENERIC_INTERNAL_SERVER_ERROR,
            'Internal server error',
            null,
          ),
        );
    }
  }

  @Get()
  async getAllCategoriess(@Res() res: Response) {
    this.logger.log(`Get all categories request initiated`);
    try {
      const categories = await this.categoryService.getAllCategories();
      return res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            true,
            ResponseCodes.GENERIC_OK,
            'All categories retrieved successfully',
            categories,
          ),
        );
    } catch (error) {
      this.logger.error(`Failed to get all categories - ${error}`);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ApiResponse(
            false,
            ResponseCodes.GENERIC_INTERNAL_SERVER_ERROR,
            'Internal server error',
            null,
          ),
        );
    }
  }

  @Put(':id')
  @UserRoles(UserType.ADMIN)
  async updateCategory(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Res() res: Response,
  ) {
    this.logger.log(`Update category request initiated`);
    try {
      const category = await this.categoryService.findCategoryById(id);
      if (!category) {
        this.logger.error(`Category not found with id: ${id}`);
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(
            new ApiResponse(
              false,
              ResponseCodes.GENERIC_NOT_FOUND,
              'Category not found',
              null,
            ),
          );
      }
      const updatedCategory = await this.categoryService.updateCategory(
        category.id,
        updateCategoryDto,
      );
      return res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            true,
            ResponseCodes.GENERIC_OK,
            'Category information updated successfully',
            updateCategoryDto,
          ),
        );
    } catch (error) {
      this.logger.error(`Update category request failed ${error}`);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ApiResponse(
            false,
            ResponseCodes.GENERIC_INTERNAL_SERVER_ERROR,
            'Internal server error',
            null,
          ),
        );
    }
  }

  @Delete(':id')
  @UserRoles(UserType.ADMIN)
  async RemoveCategory(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<any> {
    this.logger.log(`Remove category request initiated for id: ${id}`);
    try {
      const category = await this.categoryService.findCategoryById(
        parseInt(id),
      );
      if (!category) {
        this.logger.error(`Category not found with id: ${id}`);
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(
            new ApiResponse(
              false,
              ResponseCodes.GENERIC_NOT_FOUND,
              'Category not found',
              null,
            ),
          );
      }
      await this.categoryService.removeCategory(category.id);
      return res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            true,
            ResponseCodes.GENERIC_ACCEPTED,
            'Category removed successfully',
            null,
          ),
        );
    } catch (error) {
      this.logger.error(`Failed to remove category with id: ${id} - ${error}`);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ApiResponse(
            false,
            ResponseCodes.GENERIC_INTERNAL_SERVER_ERROR,
            'Internal server error',
            null,
          ),
        );
    }
  }
}
