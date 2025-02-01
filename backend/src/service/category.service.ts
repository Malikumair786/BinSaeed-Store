import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createCategoryDto } from 'src/dto/category/create-category.dto';
import { UpdateCategoryDto } from 'src/dto/category/update-category.dto';
import { Category } from 'src/model/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  private readonly logger = new Logger(CategoryService.name);

  async findCategoryById(id: number): Promise<any> {
    try {
      this.logger.log(`Fetching category with id: ${id}`);
      const category = await this.categoryRepository.findOne({ where: { id } });
      if (!category) {
        this.logger.error(`No category found with id: ${id}`);
      }
      return category;
    } catch (error) {
      this.logger.error(`Exception fetching category, ${error}`);
      throw new InternalServerErrorException();
    }
  }

  async getAllCategories(): Promise<any> {
    try {
      this.logger.log('Fetching all categories');
      const categories = await this.categoryRepository.find();
      if (categories.length === 0) {
        this.logger.error('No categories found');
      }
      return categories;
    } catch (error) {
      this.logger.error(`Exception fetching all categories, ${error}`);
      throw new InternalServerErrorException();
    }
  }

  async createCategory(createCategory: createCategoryDto): Promise<any> {
    try {
      this.logger.log(
        `Creating new category with title: ${createCategory.title}`,
      );
      const category = await this.categoryRepository.save(createCategory);
      this.logger.log(`Created new category with id: ${category.id}`);
      return category;
    } catch (error) {
      this.logger.error(`Exception creating new category, ${error}`);
      throw new InternalServerErrorException();
    }
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      this.logger.log(`Updating category with id: ${id}`);
      const category = await this.findCategoryById(id);
      if (updateCategoryDto.title) {
        category.title = updateCategoryDto.title;
      }
      if (updateCategoryDto.description) {
        category.description = updateCategoryDto.description;
      }
      const updatedCategory = await this.categoryRepository.save(category);
      this.logger.log(`Category updated successfully with id: ${id}`);
      return updatedCategory;
    } catch (error) {
      this.logger.error(`Exception updating category, ${error}`);
      throw new InternalServerErrorException();
    }
  }

  async removeCategory(id: number): Promise<any> {
    try {
      this.logger.log(`Deleting category with id: ${id}`);
      await this.categoryRepository.softDelete(id);
      this.logger.log(`Category deleted successfully with id: ${id}`);
      return true;
    } catch (error) {
      this.logger.error(`Exception deleting category, ${error}`);
      throw new InternalServerErrorException();
    }
  }

  async getTotalCategoriesCount() {
    try {
      this.logger.log(`Getting total categories count`);
      const totalCount: number = await this.categoryRepository.count();
      this.logger.log(`Total categories: ${totalCount}`);
      return totalCount;
    } catch (error) {
      this.logger.error(`Exception getting total categories count, ${error}`);
      throw new InternalServerErrorException();
    }
  }
}
