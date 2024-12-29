import { IsNotEmpty, Length } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @Length(10, 11)
  phoneNo?: number;

  @IsNotEmpty()
  address: string;
}
