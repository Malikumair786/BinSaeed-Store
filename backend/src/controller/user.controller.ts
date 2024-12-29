import {
  Body,
  Controller,
  Post,
  Logger,
  Res,
  HttpStatus,
  Inject,
  forwardRef,
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

@Controller('user')
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
}
