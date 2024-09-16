import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { User } from 'src/model/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { createResponse } from 'src/common/response-helper';
import { CommonResponse } from 'src/common/common-response.interface';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>, 
    ){}

    async createUser(createUserDto: CreateUserDto): Promise<CommonResponse<User>> {
      try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);
  
        const newUser = this.userRepository.create({
          ...createUserDto,
          passwordHash: hashedPassword,
        });
  
        const savedUser = await this.userRepository.save(newUser);

        return createResponse(true, 201, 'User created successfully', savedUser);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') { 
          return createResponse(false, 409, 'Email already exists', null); 
        }
        return createResponse(false, 500, 'Something went wrong', null); 
      }
    }
  
    async getAllUsers(): Promise<CommonResponse<User[]>> {
      try {
        const users = await this.userRepository.find();
        return createResponse(true, 200, 'Users retrieved successfully', users);
      } catch (error) {
        return createResponse(false, 500, 'Failed to fetch users'); // Return internal server error response
      }
    }
}
