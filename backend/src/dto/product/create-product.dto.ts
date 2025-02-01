import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProductVariantDto } from './create-product-variant.dto';
import { CreateProductImageDto } from './create-product-image.dto';
import { CreateProductTagDto } from './create-product-tag.dto';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductTagDto)
  tags?: CreateProductTagDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants?: CreateProductVariantDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  images?: CreateProductImageDto[];
}
