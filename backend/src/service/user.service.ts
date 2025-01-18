import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from 'src/common/password.util';
import { ChangePasswordDto } from 'src/dto/user/change-password.dto';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { UpdateUserDto } from 'src/dto/user/updateUser.dto';
import { User } from 'src/model/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private logger = new Logger(UserService.name);

  async findOneByEmail(email: string): Promise<User> {
    try {
      this.logger.log(`Fetching user by email: ${email}`);
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        this.logger.error(`No user found with email: ${email}`);
      }
      return user;
    } catch (error) {
      this.logger.error(`Exception fetching user, ${error}`);
      throw new InternalServerErrorException();
    }
  }

  async getUserById(userId: number): Promise<User> {
    try {
      this.logger.log(`Fetching user with id: ${userId}`);
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        this.logger.error(`No user found with id: ${userId}`);
      }
      return user;
    } catch (error) {
      this.logger.error(`Exception fetching user, ${error}`);
      throw new InternalServerErrorException();
    }
  }

  async verifyAccount(userId: number) {
    try {
      this.logger.log(`Verifying account for userId: ${userId}`);
      await this.userRepository.update(userId, { isVerified: true });
      this.logger.log(`Successfully verified account for userId: ${userId}`);
    } catch (ex) {
      this.logger.error(`Exception verifying account, ${ex}`);
      throw new InternalServerErrorException();
    }
  }

  async updatePassword(userId: number, password: string) {
    try {
      this.logger.log(`Updating password of user with id: ${userId}`);
      const hashedPassword = await hashPassword(password);
      await this.userRepository.update(userId, { password: hashedPassword });
      this.logger.log(`Successfully updated password`);
    } catch (ex) {
      this.logger.error(`Exception updating password, ${ex}`);
      throw new InternalServerErrorException();
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    try {
      this.logger.log(`Creating user with email: ${createUserDto.email}`);
      var random = require(`random-string-alphanumeric-generator`);
      let hashedPassword = null;
      if (createUserDto.password) {
        hashedPassword = await hashPassword(createUserDto.password);
      }
      const apiKey = random.randomAlphanumeric(32, 'uppercase');
      let newUser: User = null;
      if (hashedPassword === null) {
        // Users who signed up using facebook or google
        newUser = this.userRepository.create({
          ...createUserDto,
          apiKey: apiKey,
        });
      } else {
        newUser = this.userRepository.create({
          ...createUserDto,
          password: hashedPassword,
          apiKey: apiKey,
        });
      }
      const user = await this.userRepository.save(newUser);
      this.logger.log(`User created successfully with id: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error(`Exception creating new user: ${error}`);
      throw new InternalServerErrorException();
    }
  }

  async updateUserInfo(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      this.logger.log(`Updating info for user with id: ${userId}`);
      const user = await this.userRepository.findOne({ where: { id: userId } });
      Object.assign(user, updateUserDto);
      await this.userRepository.save(user);
      this.logger.log(
        `User information updated successfully for userId: ${userId}`,
      );
      return user;
    } catch (error) {
      this.logger.error(`Exception updating user info, ${error}`);
      throw new InternalServerErrorException();
    }
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    try {
      this.logger.log(`Updating password for user with id: ${userId}}`);
      const newHashedPassword = await hashPassword(
        changePasswordDto.newPassword,
      );
      await this.userRepository.update(userId, { password: newHashedPassword });
      this.logger.log(`Successfully updated password`);
    } catch (error) {
      this.logger.error(`Exception updating password, ${error}`);
      throw new InternalServerErrorException();
    }
  }
}
