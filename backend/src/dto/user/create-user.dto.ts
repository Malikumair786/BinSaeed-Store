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

  @IsNotEmpty()
  @Length(10, 11)
  phoneNo: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  confirmPassword: string;

  isVerified: boolean;

  @IsEnum(LoggedInWith)
  @IsOptional()
  loggedInWith?: LoggedInWith;
}
