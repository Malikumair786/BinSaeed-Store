import { IsNotEmpty } from 'class-validator';

export class CreateLink {
  @IsNotEmpty()
  link: string;
  @IsNotEmpty()
  expiry: Date;
  @IsNotEmpty()
  userId: number;
  @IsNotEmpty()
  token: string;
}
