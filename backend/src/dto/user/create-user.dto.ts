import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
  Length,
} from 'class-validator';
import { LoggedInWith } from 'src/common/logged-in-with.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(3, 50)
  username: string;

  @IsOptional()
  @Length(10, 11)
  phoneNo?: string;

  @IsOptional()
  address: string;

  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsStrongPassword()
  password?: string;

  @IsOptional()
  confirmPassword?: string;

  isVerified: boolean;

  @IsEnum(LoggedInWith)
  @IsOptional()
  loggedInWith?: LoggedInWith;
}
