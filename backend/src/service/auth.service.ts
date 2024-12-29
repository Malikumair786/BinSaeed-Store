import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SignInDto } from 'src/dto/auth/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  private logger = new Logger(AuthService.name);

  async validateUser(signInDto: SignInDto): Promise<any> {
    this.logger.log(`Validating user: ${signInDto.email}`);

    const user = await this.usersService.findOneByEmail(signInDto.email);

    if (!user) {
      this.logger.error(`User not found: ${signInDto.email}`);
      return null;
    }

    if (!user.password) {
      this.logger.error(
        `User account is connected with Google: ${signInDto.email}`,
      );
      return user;
    }

    const isPasswordMatch = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (isPasswordMatch) {
      this.logger.log(`Password match for user: ${user.email}`);
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }

    this.logger.error(`Invalid password for user: ${signInDto.email}`);
    return null;
  }

  async login(user: any) {
    try {
      this.logger.log(`Creating JWT token for user ${user.email}`);
      const payload = {
        username: user.username,
        email: user.email,
        sub: user.id,
        role: user.role,
      };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (ex) {
      this.logger.error(`Exception logging in user, ${ex}`);
      throw new InternalServerErrorException();
    }
  }
}
