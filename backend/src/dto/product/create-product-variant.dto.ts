import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductVariantDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
