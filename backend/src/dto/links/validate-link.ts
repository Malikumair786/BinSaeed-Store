import { IsNotEmpty } from 'class-validator';

export class ValidateLink {
  @IsNotEmpty()
  token: string;
  @IsNotEmpty()
  key: string;
}
