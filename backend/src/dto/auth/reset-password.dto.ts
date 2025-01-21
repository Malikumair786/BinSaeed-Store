import { IsNotEmpty, Matches } from 'class-validator';

export class UserResetPasswordRequest {
  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
    message: 'Password Requirements not met',
  })
  password: string;
  @IsNotEmpty()
  key: string;
  @IsNotEmpty()
  token: string;
}
