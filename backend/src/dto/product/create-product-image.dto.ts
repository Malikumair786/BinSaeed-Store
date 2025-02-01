import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateProductImageDto {
  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;
}
