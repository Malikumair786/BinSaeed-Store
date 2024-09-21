import { ConflictException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { User } from 'src/model/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { createResponse } from 'src/common/response-helper';
import { CommonResponse } from 'src/common/common-response.interface';
import { UpdateUserDto } from 'src/dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async createUser(createUserDto: CreateUserDto): Promise<CommonResponse<User>> {
      try {
          // Check if the email already exists
          const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
          if (existingUser) {
              return createResponse(false, HttpStatus.CONFLICT, 'Email already exists', null);
          }
  
          // Hash the password
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);
  
          // Create the new user object
          const newUser = this.userRepository.create({
              ...createUserDto,
              password: hashedPassword,
          });
  
          // Save the new user to the database
          const savedUser = await this.userRepository.save(newUser);
          return createResponse(true, HttpStatus.CREATED, 'User created successfully', null);
      } catch (error) {
          return createResponse(false, HttpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong', null);
      }
  }
  
    async getUserById(userId: number): Promise<CommonResponse<any>> {
        try {
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                return createResponse(false, HttpStatus.NOT_FOUND, 'User not found', null);
            }

            const {password, ...userWithoutPassword} = user;
            return createResponse(true, HttpStatus.OK, 'User retrieved successfully', userWithoutPassword);
        } catch (error) {
            return createResponse(false, HttpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong', null);
        }
    }

    async getAllUsers(): Promise<CommonResponse<User[]>> {
        try {
          const users = await this.userRepository.find({
            select: ['id', 'firstName', 'lastName', 'phone', 'email', 'address', 'isActive', 'isAuthenticated', 'role']
        });
            return createResponse(true, HttpStatus.OK, 'Users retrieved successfully', users);
        } catch (error) {
            return createResponse(false, HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch users', null);
        }
    }

    async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<CommonResponse<any>> {
      try {
        if ('email' in updateUserDto) {
          return createResponse(false, HttpStatus.FORBIDDEN, 'You are not allowed to change the email', null);
        }
        if ('password' in updateUserDto) {
          return createResponse(false, HttpStatus.FORBIDDEN, 'You are not allowed to change the password', null);
        }

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
          return createResponse(false, HttpStatus.NOT_FOUND, 'User not found', null);
        }
  
        const updatedUser = {
          ...user,
          ...updateUserDto,
        };
  
        await this.userRepository.save(updatedUser);

        const {password, ...updatedUserWithoutPassword} = updatedUser;
  
        return createResponse(true, HttpStatus.OK, 'User updated successfully', updatedUserWithoutPassword);
      } catch (error) {
        return createResponse(false, HttpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong', null);
      }
    }

    async removeUser(userId: number): Promise<CommonResponse<any>> {
      try {
        const user = await this.userRepository.findOne({ where: { id: userId } });
    
        if (!user) {
          return createResponse(false, HttpStatus.NOT_FOUND, 'User not found', null);
        }
    
        await this.userRepository.remove(user);

        return createResponse(true, HttpStatus.OK, 'User removed successfully', null);
      } catch (error) {
        return createResponse(false, HttpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong', null);
      }
    }
    
}
