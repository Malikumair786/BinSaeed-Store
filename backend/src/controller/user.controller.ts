import {
  Body,
  Controller,
  Post,
  Logger,
  Res,
  HttpStatus,
  Inject,
  forwardRef,
  Patch,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from 'src/common/api-response';
import { LoggedInWith } from 'src/common/logged-in-with.enum';
import { ResponseCodes } from 'src/common/response-codes.enum';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { SendEmailDto } from 'src/dto/mail/send-mail';
import { User } from 'src/model/user.entity';
import { LinkService } from 'src/service/link.service';
import { MailerService } from 'src/service/mailer.service';
import { UserService } from 'src/service/user.service';
import { SkipAuth } from 'src/guard/skipAuth.guard';
import { ChangePasswordDto } from 'src/dto/user/change-password.dto';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => LinkService))
    private linkService: LinkService,
    @Inject(forwardRef(() => MailerService))
    private mailerService: MailerService,
  ) {}

  private logger = new Logger(UserController.name);

  @SkipAuth()
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      this.logger.log(`creating new user with email ${createUserDto.email}`);
      if (!createUserDto.loggedInWith) {
        createUserDto.loggedInWith = LoggedInWith.EMAIL;
      }
      const user = await this.userService.findOneByEmail(createUserDto.email);
      if (user) {
        return res
          .status(HttpStatus.FORBIDDEN)
          .json(
            new ApiResponse(
              true,
              ResponseCodes.USER_ALREADY_EXISTS,
              'User already exists',
            ),
          );
      }
      if (createUserDto.password !== createUserDto.confirmPassword) {
        this.logger.error(`Password and Confirm password do not match`);
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new ApiResponse(
              false,
              ResponseCodes.GENERIC_BAD_REQUEST,
              'User password and conform password not match',
            ),
          );
      }
      const newUser: User = await this.userService.createUser(createUserDto);
      await this.sendVerificationEmail(newUser);
      this.logger.log(`Signup successful for user: ${createUserDto.email}`);
      return res
        .status(HttpStatus.CREATED)
        .json(
          new ApiResponse(
            true,
            ResponseCodes.USER_CREATED,
            'User created successfully',
            { email: newUser.email },
          ),
        );
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ApiResponse(
            true,
            ResponseCodes.GENERIC_INTERNAL_SERVER_ERROR,
            'Internal Server Error',
          ),
        );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req, @Res() res: Response) {
    this.logger.log(`Fetching profile for user: ${req.user.email}`);
    try {
      return res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            true,
            ResponseCodes.GENERIC_OK,
            'User basic information',
            req.user,
          ),
        );
    } catch (error) {
      this.logger.error(`Error fetching user basic information: ${error}`);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ApiResponse(
            false,
            ResponseCodes.GENERIC_INTERNAL_SERVER_ERROR,
            'Internal Server Error',
            null,
          ),
        );
    }
  }

  private async sendVerificationEmail(user: User) {
    try {
      const link = await this.linkService.createLinkVerifyEmail(
        user.id,
        user.apiKey,
      );
      const mailDto: SendEmailDto = {
        recipient: {
          name: user.username,
          address: user.email,
        },
        subject: 'BinSaeed Store: Account Verification',
        text: `Here is the link to verify your email (valid for 30 minutes): ${link}`,
      };
      this.logger.log('Sending email with request: ' + JSON.stringify(mailDto));
      const result = await this.mailerService.sendEmail(mailDto);
      this.logger.log(
        'Email with body "' + mailDto.text + '" sent successfully.',
      );
      this.logger.log('Result -> ' + JSON.stringify(result));
    } catch (error) {
      this.logger.error(`Error sending verification email: ${error}`);
    }
  }
  @Patch('change-password')
  async changePassword(
    @Req() req,
    @Body() changePasswordDto: ChangePasswordDto,
    @Res() res: Response,
  ) {
    try {
      const userId = req.user.userId;
      this.logger.log(
        `Password change request initiated for user with ID: ${userId}`,
      );
      const user = await this.userService.getUserById(userId);
      if (!user) {
        this.logger.log(`No user found with this id: ${userId}`);
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(
            new ApiResponse(
              false,
              ResponseCodes.USER_NOT_FOUND,
              'No user found for this id.',
            ),
          );
      }

      if (user.password) {
        const isPasswordMatch = await bcrypt.compare(
          changePasswordDto.oldPassword,
          user.password,
        );
        if (!isPasswordMatch) {
          this.logger.error(`Incorrect Old password for user: ${userId}`);
          return res
            .status(HttpStatus.NOT_FOUND)
            .json(
              new ApiResponse(
                false,
                ResponseCodes.USER_NOT_FOUND,
                'Incorrect old password.',
              ),
            );
        }
      }

      if (
        changePasswordDto.newPassword !==
        changePasswordDto.newPasswordConfirmation
      ) {
        this.logger.error(`Password confirmation mismatch for user: ${userId}`);
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(
            new ApiResponse(
              false,
              ResponseCodes.USER_NOT_FOUND,
              'New password and confirmation do not match',
            ),
          );
      }
      await this.userService.changePassword(userId, changePasswordDto);
      this.logger.log(`Password changed successfully for user ID: ${userId}`);
      return res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            true,
            ResponseCodes.GENERIC_OK,
            'Password changed successfully',
          ),
        );
    } catch (error) {
      this.logger.error(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ApiResponse(
            false,
            ResponseCodes.GENERIC_INTERNAL_SERVER_ERROR,
            'Internal Server Error',
            null,
          ),
        );
    }
  }
}
