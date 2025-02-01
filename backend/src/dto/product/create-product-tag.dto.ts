import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductTagDto {
  @IsNotEmpty()
  @IsString()
  name: string; // e.g., "Organic", "New Arrival"
}
