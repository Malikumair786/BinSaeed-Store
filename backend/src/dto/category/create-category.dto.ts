import { IsNotEmpty, IsString } from 'class-validator';

export class createCategoryDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
