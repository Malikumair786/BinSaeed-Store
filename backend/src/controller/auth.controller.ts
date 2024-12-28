import {
  Controller,
  Req,
  Post,
  UseGuards,
  Get,
  Logger,
  Param,
  Res,
  HttpStatus,
  forwardRef,
  Inject,
  Body,
  Query,
  HttpException,
  Patch,
  InternalServerErrorException,
  Headers,
  UseFilters,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { ApiResponse } from '../common/api-response';
import { LoggedInWith } from '../common/logged-in-with.enum';
import { ResponseCodes } from '../common/response-codes.enum';
import { UserType } from 'src/common/user-type.enum';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { UserResetPasswordRequest } from 'src/dto/auth/reset-password';
import { ValidateLink } from 'src/dto/links/validate-link';
import { SendEmailDto } from '../dto/mail/send-mail';
import { UpdateUserDto } from 'src/dto/user/updateUser.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { LocalAuthGuard } from 'src/guard/local-auth.guard';
import { SkipAuth } from 'src/guard/skipAuth.guard';
import { Link } from '../model/links.entity';
import { AuthService } from 'src/service/auth.service';
import { LinkService } from '../service/link.service';
import { MailerService } from '../service/mailer.service';
import { UserService } from '../service/user.service';
import { User } from '../model/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedRedirectFilter } from 'src/filter/unauthorized-redirect.filter';

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => LinkService))
    private linkService: LinkService,
    @Inject(forwardRef(() => MailerService))
    private mailerService: MailerService,
  ) {}

  private logger = new Logger(AuthController.name);

  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res() res: Response) {
    try {
      this.logger.log(`Logging in user with email: ${req.user.email}`);
      const user = await this.userService.findOneByEmail(req.user.email);
      if (user === null) {
        this.logger.error('No user found');
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(
            new ApiResponse(
              false,
              ResponseCodes.USER_NOT_FOUND,
              'No user found for this email.',
            ),
          );
      }

      if (!user.isVerified) {
        await this.sendVerificationEmail(user);
        return res
          .status(HttpStatus.OK)
          .json(
            new ApiResponse(
              true,
              ResponseCodes.USER_NOT_VERIFIED,
              'Verification email sent.',
            ),
          );
      }

      if (user.role !== UserType.USER) {
        this.logger.error(
          'You are not authorized to access this resource, Normal User only',
        );
        return res
          .status(HttpStatus.FORBIDDEN)
          .json(
            new ApiResponse(
              false,
              ResponseCodes.USER_NOT_AUTHORIZED,
              'You are not authorized to access this resource',
            ),
          );
      }

      if (user.password === null) {
        if (user.loggedInWith === LoggedInWith.GOOGLE) {
          this.logger.error(
            'Your account is connected with google. Kindly try login with google',
          );
          return res
            .status(HttpStatus.FORBIDDEN)
            .json(
              new ApiResponse(
                false,
                ResponseCodes.USER_HAS_NO_PASSWORD,
                'Your account is connected with google. Kindly try login with google',
              ),
            );
        } else if (user.loggedInWith === LoggedInWith.FACEBOOK) {
          this.logger.error(
            'Your account is connected with facebook. Kindly try login with facebook',
          );
          return res
            .status(HttpStatus.FORBIDDEN)
            .json(
              new ApiResponse(
                false,
                ResponseCodes.USER_HAS_NO_PASSWORD,
                'Your account is connected with facebook. Kindly try login with facebook',
              ),
            );
        }
      }

      const response = await this.authService.login(req.user);
      this.logger.log(`Login successful for: ${req.user.email}`);
      return res.status(HttpStatus.OK).json(
        new ApiResponse(
          true,
          ResponseCodes.USER_LOGGED_IN,
          'Login successful.',
          {
            access_token: response.access_token,
          },
        ),
      );
    } catch (error) {
      this.logger.error(`Login failed for: ${req.user.email}`, error.stack);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ApiResponse(
            false,
            ResponseCodes.GENERIC_INTERNAL_SERVER_ERROR,
            'Internal Server Error',
          ),
        );
    }
  }

  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @Post('login-admin')
  async loginAdmin(@Req() req, @Res() res: Response) {
    this.logger.log(`Login request initiated for user: ${req.user.email}`);
    try {
      const user = await this.userService.findOneByEmail(req.user.email);
      if (user === null) {
        this.logger.error('No user found');
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(
            new ApiResponse(
              false,
              ResponseCodes.USER_NOT_FOUND,
              'No user found for this email.',
            ),
          );
      }

      if (user.role !== UserType.ADMIN) {
        this.logger.error('Not an admin User');
        return res
          .status(HttpStatus.FORBIDDEN)
          .json(
            new ApiResponse(
              false,
              ResponseCodes.USER_NOT_AUTHORIZED,
              'You are not authorized to access this resource. Admins only.',
            ),
          );
      }

      const response = await this.authService.login(req.user);
      this.logger.log(`Login successful for: ${req.user.email}`);
      return res.status(HttpStatus.OK).json(
        new ApiResponse(
          true,
          ResponseCodes.USER_LOGGED_IN,
          'Login successful.',
          {
            access_token: response.access_token,
          },
        ),
      );
    } catch (error) {
      this.logger.error(`Login failed for: ${req.user.email}`, error.stack);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ApiResponse(
            false,
            ResponseCodes.GENERIC_INTERNAL_SERVER_ERROR,
            'Internal Server Error',
          ),
        );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req) {
    this.logger.log(`Fetching profile for user: ${req.user.email}`);
    return req.user;
  }

  @SkipAuth()
  @Get('forgot-password/:email')
  async forgotPassword(@Param('email') email: string, @Res() res: Response) {
    try {
      const user = await this.userService.findOneByEmail(email);
      if (!user) {
        this.logger.log(`No user found with email: ${email}`);
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(
            new ApiResponse(
              false,
              ResponseCodes.USER_NOT_FOUND,
              'No user found for this email.',
            ),
          );
      }
      const link = await this.linkService.createLinkForgetPassword(
        user.id,
        user.apiKey,
        user.role,
      );
      const mailDto: SendEmailDto = {
        recipient: {
          name: user.username,
          address: user.email,
        },
        subject: 'Bin Saeed Store: Reset Your Password',
        text: `Here is the link to reset your password (it is only valid for 30 minutes): ${link}`,
      };

      await this.mailerService.sendEmail(mailDto);
      this.logger.log(
        `Password reset link sent successfully to: ${user.email}`,
      );
      return res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            true,
            ResponseCodes.USER_EMAIL_LINK_SENT,
            'Password reset link sent successfully.',
          ),
        );
    } catch (error) {
      this.logger.error(
        `Error processing Forgot Password request: ${error.message}`,
      );
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ApiResponse(
            false,
            ResponseCodes.GENERIC_INTERNAL_SERVER_ERROR,
            'Internal Server Error',
          ),
        );
    }
  }

  @SkipAuth()
  @Post('validate-link')
  async validateLink(@Body() link: ValidateLink, @Res() res: Response) {
    try {
      const validateLinks = await this.linkService.validateLinks(link);
      if (validateLinks) {
        return res
          .status(HttpStatus.OK)
          .json(
            new ApiResponse(true, ResponseCodes.GENERIC_OK, 'Link is valid'),
          );
      }
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new ApiResponse(
            false,
            ResponseCodes.GENERIC_BAD_REQUEST,
            'Link is invalid.',
          ),
        );
    } catch (error) {
      this.logger.error(`Error validating link: ${error.message}`);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ApiResponse(
            false,
            ResponseCodes.GENERIC_INTERNAL_SERVER_ERROR,
            'Internal Server Error',
          ),
        );
    }
  }

  @SkipAuth()
  @Post('validate-link-admin')
  async validateLinkAdmin(@Body() link: ValidateLink, @Res() res: Response) {
    try {
      const validateLinks = await this.linkService.validateLinkAdmin(link);
      if (validateLinks) {
        return res
          .status(HttpStatus.OK)
          .json(
            new ApiResponse(true, ResponseCodes.GENERIC_OK, 'Link is valid'),
          );
      }
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new ApiResponse(
            false,
            ResponseCodes.GENERIC_BAD_REQUEST,
            'Link is invalid.',
          ),
        );
    } catch (error) {
      this.logger.error(`Error validating link Admin: ${error.message}`);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ApiResponse(
            false,
            ResponseCodes.GENERIC_INTERNAL_SERVER_ERROR,
            'Internal Server Error',
          ),
        );
    }
  }

  @SkipAuth()
  @Post('verify')
  async verifyEmail(@Body() link: ValidateLink, @Res() res: Response) {
    try {
      const tempLink = new ValidateLink();
      tempLink.key = link.key;
      tempLink.token = link.token;
      const validateLink = await this.linkService.validateLinks(tempLink);
      if (!validateLink) {
        this.logger.error('Link is not valid');
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new ApiResponse(
              false,
              ResponseCodes.USER_BAD_REQUEST,
              'Link is invalid.',
            ),
          );
      }
      this.logger.log('Successfully validated Link');
      const fetchedLink: Link = await this.linkService.getLinkByToken(
        link.token,
      );
      if (fetchedLink == null) {
        this.logger.error('Link tokens do not match');
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(
            new ApiResponse(
              false,
              ResponseCodes.USER_NOT_AUTHORIZED,
              'Unauthorized',
            ),
          );
      }
      const user = await this.userService.getUserById(fetchedLink.userId);
      if (user == null) {
        this.logger.error('User not found for userId: ' + fetchedLink.userId);
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(
            new ApiResponse(
              false,
              ResponseCodes.USER_NOT_FOUND,
              'No user found',
            ),
          );
      }
      if (link.key !== user.apiKey) {
        this.logger.error('API key mismatch for userId: ' + fetchedLink.userId);
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(
            new ApiResponse(
              false,
              ResponseCodes.USER_NOT_AUTHORIZED,
              'Unauthorized',
            ),
          );
      }
      await this.userService.verifyAccount(user.id);
      await this.linkService.deactivateLink(fetchedLink.id);
      this.logger.log(
        'Successfully verified account for userId: ' + fetchedLink.userId,
      );
      const response = await this.authService.login(user);
      return res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            true,
            ResponseCodes.USER_LOGGED_IN,
            'Account verified',
            { access_token: response.access_token },
          ),
        );
    } catch (error) {
      this.logger.error('Error while verifying account, Exception: ' + error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ApiResponse(
            false,
            ResponseCodes.GENERIC_INTERNAL_SERVER_ERROR,
            'Internal Server Error',
          ),
        );
    }
  }

  @SkipAuth()
  @Post('reset-password')
  async resetPassword(
    @Body() resetRequest: UserResetPasswordRequest,
    @Res() res: Response,
  ) {
    try {
      const tempLink = new ValidateLink();
      tempLink.key = resetRequest.key;
      tempLink.token = resetRequest.token;
      const validateLink = await this.linkService.validateLinks(tempLink);
      if (!validateLink) {
        this.logger.error('Link is not valid');
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new ApiResponse(
              false,
              ResponseCodes.USER_BAD_REQUEST,
              'Link is invalid.',
            ),
          );
      }
      this.logger.log('Successfully validated Link');
      const link = await this.linkService.getLinkByToken(resetRequest.token);
      if (link == null) {
        this.logger.error('Link tokens do not match');
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(
            new ApiResponse(
              false,
              ResponseCodes.USER_NOT_AUTHORIZED,
              'Unauthorized',
            ),
          );
      }
      const user = await this.userService.getUserById(link.userId);
      if (user == null) {
        this.logger.error('User not found for userId: ' + link.userId);
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(
            new ApiResponse(
              false,
              ResponseCodes.USER_NOT_FOUND,
              'No user found',
            ),
          );
      }
      if (resetRequest.key !== user.apiKey) {
        this.logger.error('API key mismatch for userId: ' + link.userId);
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(
            new ApiResponse(
              false,
              ResponseCodes.USER_NOT_AUTHORIZED,
              'Unauthorized',
            ),
          );
      }
      await this.userService.updatePassword(user.id, resetRequest.password);
      await this.linkService.deactivateLink(link.id);
      this.logger.log(
        'Successfully changed password for userId: ' + link.userId,
      );
      return res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            true,
            ResponseCodes.USER_SUCCESS,
            'Password successfully changed',
          ),
        );
    } catch (error) {
      this.logger.error('Error while resetting password, Exception: ' + error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ApiResponse(
            false,
            ResponseCodes.GENERIC_INTERNAL_SERVER_ERROR,
            'Internal Server Error.',
          ),
        );
    }
  }

  @SkipAuth()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: any) {}

  @SkipAuth()
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {}

  @SkipAuth()
  @UseFilters(UnauthorizedRedirectFilter)
  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(
    @Req() req: any,
    @Res() res: Response,
  ): Promise<any> {
    try {
      if (!req.user.user) {
        res.redirect(process.env.USER_APP_BASEURL + '/login');
      }
      this.logger.log(`User received from Facebook: ${req.user.user.email}`);
      const user = await this.userService.findOneByEmail(req.user.user.email);
      if (!user) {
        const signUpRequest: CreateUserDto = {
          username: `${req.user.user.firstName} ${req.user.user.lastName}`,
          phoneNo: null,
          address: null,
          email: req.user.user.email,
          password: null,
          confirmPassword: null,
          isVerified: true,
          loggedInWith: LoggedInWith.FACEBOOK,
        };

        const signUpResponse = await this.signUpLogic(req, signUpRequest);

        if (!signUpResponse) {
          return res.redirect(
            `${process.env.USER_APP_BASEURL}/login?error=InternalServerError`,
          );
        }
        res.cookie('userId', signUpResponse.id, {
          secure: true,
          sameSite: 'lax',
        });
        return res.redirect(`${process.env.USER_APP_BASEURL}/signup-info`);
      }

      this.logger.log(`User exists, logging in: ${user.email}`);
      if (user.phoneNo == null || user.address == null) {
        res.cookie('userId', user.id, {
          secure: true,
          sameSite: 'lax',
        });
        return res.redirect(`${process.env.USER_APP_BASEURL}/signup-info`);
      }
      const loginResponse = await this.authService.login(user);
      res.cookie('access_token', loginResponse.access_token, {
        secure: true,
        sameSite: 'lax',
      });

      return res.redirect(`${process.env.USER_APP_BASEURL}/dashboard`);
    } catch (error) {
      this.logger.error('Error in Facebook Auth Redirect:', error);
      return res.redirect(`${process.env.USER_APP_BASEURL}/login`);
    }
  }

  @SkipAuth()
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    try {
      if (!req.user) {
        res.redirect(process.env.USER_APP_BASEURL + '/login');
      }
      this.logger.log(`User received from Google: ${req.user.email}`);
      const user = await this.userService.findOneByEmail(req.user.email);
      if (!user) {
        const signUpRequest: CreateUserDto = {
          username: `${req.user.firstName} ${req.user.lastName}`,
          phoneNo: null,
          address: null,
          email: req.user.email,
          password: null,
          confirmPassword: null,
          isVerified: true,
          loggedInWith: LoggedInWith.GOOGLE,
        };

        const signUpResponse = await this.signUpLogic(req, signUpRequest);

        if (!signUpResponse) {
          return res.redirect(
            `${process.env.USER_APP_BASEURL}/login?error=InternalServerError`,
          );
        }
        res.cookie('userId', signUpResponse.id, {
          secure: true,
          sameSite: 'lax',
        });
        return res.redirect(`${process.env.USER_APP_BASEURL}/signup-info`);
      }

      this.logger.log(`User exists, logging in: ${user.email}`);
      if (user.phoneNo == null || user.address == null) {
        res.cookie('userId', user.id, {
          secure: true,
          sameSite: 'lax',
        });
        return res.redirect(`${process.env.USER_APP_BASEURL}/signup-info`);
      }
      const loginResponse = await this.authService.login(user);
      res.cookie('access_token', loginResponse.access_token, {
        secure: true,
        sameSite: 'lax',
      });
      return res.redirect(`${process.env.USER_APP_BASEURL}/dashboard`);
    } catch (error) {
      this.logger.error('Error in Google Auth Redirect:', error);
      return res.redirect(`${process.env.USER_APP_BASEURL}/login`);
    }
  }

  @SkipAuth()
  @Patch('update-user-info/:userId')
  async updateUser(
    @Req() req,
    @Param('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    try {
      const user = await this.userService.getUserById(userId);
      if (user == null) {
        this.logger.error('User not found for userId: ' + userId);
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(
            new ApiResponse(
              false,
              ResponseCodes.USER_NOT_FOUND,
              'No user found',
            ),
          );
      }
      const updatedUser = await this.userService.updateUserInfo(
        user.id,
        updateUserDto,
      );
      const loginUserResponse = await this.authService.login(updatedUser);
      await this.userService.verifyAccount(user.id);
      return res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            true,
            ResponseCodes.USER_CREATED,
            'User information updated successfully',
            loginUserResponse,
          ),
        );
    } catch (error) {
      this.logger.error(
        `Error during updating user with userId: ${req.user.userId}`,
        error,
      );
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ApiResponse(
            false,
            ResponseCodes.GENERIC_INTERNAL_SERVER_ERROR,
            'Internal Server Error.',
          ),
        );
    }
  }

  @Get('/registration-status')
  async checkRegistrationStatus(@Req() req, @Res() res: Response) {
    try {
      const user = await this.userService.getUserById(req.user.userId);
      if (user === null) {
        this.logger.error('No user found');
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(
            new ApiResponse(
              false,
              ResponseCodes.USER_NOT_FOUND,
              'User not found',
            ),
          );
      }
      if (user.loggedInWith === LoggedInWith.EMAIL) {
        return res
          .status(HttpStatus.OK)
          .json(
            new ApiResponse(
              true,
              ResponseCodes.USER_HAS_PASSWORD,
              'Status Checked',
            ),
          );
      }
      if (user.password == null) {
        return res
          .status(HttpStatus.OK)
          .json(
            new ApiResponse(
              true,
              ResponseCodes.USER_HAS_NO_PASSWORD,
              'Status Checked',
            ),
          );
      }
      return res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            true,
            ResponseCodes.USER_HAS_PASSWORD,
            'Status Checked',
          ),
        );
    } catch (error) {
      this.logger.error(
        `Error fetching registeration status: ${error.message}`,
      );
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ApiResponse(
            false,
            ResponseCodes.GENERIC_INTERNAL_SERVER_ERROR,
            'Internal Server Error',
          ),
        );
    }
  }

  private async signUpLogic(
    req: any,
    createUserDto: CreateUserDto,
  ): Promise<any> {
    try {
      this.logger.log(
        `Checking if user exists for email: ${createUserDto.email}`,
      );
      const existingUser = await this.userService.findOneByEmail(
        createUserDto.email,
      );

      if (existingUser) {
        this.logger.error(
          `Account with email ${createUserDto.email} already exists.`,
        );
        return new ApiResponse(
          false,
          'USER_ALREADY_EXISTS',
          'Account already exists.',
        );
      }

      const newUser = await this.userService.createUser(createUserDto);
      return newUser;
    } catch (error) {
      this.logger.error(`Error in sign-up logic: ${error}`);
      throw new InternalServerErrorException(error);
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
        subject: 'Bin Saeed Store: Account Verification',
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
