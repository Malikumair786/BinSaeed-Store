import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from 'src/model/links.entity';
import { CreateLink } from 'src/dto/links/create-link';
import { UserService } from './user.service';
import { UserType } from 'src/common/user-type.enum';
import { ValidateLink } from 'src/dto/links/validate-link';

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
    @Inject(forwardRef(() => UserService)) // Use forwardRef here
    private readonly userService: UserService,
  ) {}

  private logger = new Logger(LinkService.name);

  async createLinkForgetPassword(
    userId: number,
    key: string,
    role: UserType,
  ): Promise<string | null> {
    try {
      var random = require('random-string-alphanumeric-generator');
      const expiry = new Date();
      expiry.setTime(expiry.getTime() + 30 * 60000);
      const token = random.randomAlphanumeric(32, 'uppercase');
      const link = new CreateLink();
      link.userId = userId;
      link.expiry = expiry;
      link.token = token;
      if (role == UserType.USER) {
        link.link = `${process.env.USER_APP_BASEURL}/reset-password?code=${token}&key=${key}`;
      } else if (role == UserType.ADMIN) {
        link.link = `${process.env.ADMIN_APP_BASEURL}/reset-password?code=${token}&key=${key}`;
      }
      this.linkRepository.save(link);
      return link.link;
    } catch (ex) {
      this.logger.error(
        'Error creating forget password link with exception ' + ex,
      );
      return null;
    }
  }

  async createLinkVerifyEmail(
    userId: number,
    key: string,
  ): Promise<string | null> {
    try {
      var random = require('random-string-alphanumeric-generator');
      const expiry = new Date();
      // Setting expiry 24 hours into future of creation time
      expiry.setTime(expiry.getTime() + 30 * 60000);
      const token = random.randomAlphanumeric(32, 'uppercase');
      const link = new CreateLink();
      link.userId = userId;
      link.expiry = expiry;
      link.token = token;
      link.link = `${process.env.USER_APP_BASEURL}/verify-account?code=${token}&key=${key}`;
      this.linkRepository.save(link);
      return link.link;
    } catch (ex) {
      this.logger.error(
        'Error creating verification email link with exception ' + ex,
      );
      return null;
    }
  }
  async validateLinks(link: ValidateLink): Promise<boolean> {
    try {
      this.logger.log('Validating link');
      const token = link.token;

      const savedLink = await this.linkRepository.findOne({
        where: {
          token,
        },
        order: {
          expiry: 'DESC',
        },
      });

      if (savedLink == null) {
        this.logger.error('No saved link found');
        return false;
      } else {
        this.logger.log('Link found for userId: ' + savedLink.userId);

        let user = await this.userService.getUserById(savedLink.userId);

        if (user == null) {
          this.logger.log('User not found for userId: ' + savedLink.userId);
          return false;
        }

        if (link.key === user.apiKey) {
          if (savedLink.openCount >= 3) {
            this.logger.error('User has exceeded allowed link visits');
            await this.linkRepository.softDelete(savedLink.id);
            return false;
          } else {
            if (savedLink.expiry > new Date()) {
              this.logger.log(
                'Successfully validated link for userId: ' + savedLink.userId,
              );
              const openValue = savedLink.openCount + 1;
              await this.linkRepository.update(savedLink.id, {
                openCount: openValue,
              });
              return true; // The link has been validated
            } else {
              this.logger.error('Link has expired');
              return false; // The link has expired
            }
          }
        } else {
          this.logger.log('Api Key is invalid');
          return false;
        }
      }
    } catch (ex) {
      this.logger.error('Exception occurred ' + ex);
      return false;
    }
  }

  async validateLinkAdmin(link: ValidateLink): Promise<boolean> {
    try {
      this.logger.log('Validating link');
      const token = link.token;

      const savedLink = await this.linkRepository.findOne({
        where: {
          token,
        },
        order: {
          expiry: 'DESC',
        },
      });

      if (savedLink == null) {
        this.logger.error('No saved link found');
        return false;
      } else {
        this.logger.log('Link found for userId: ' + savedLink.userId);

        let user = await this.userService.getUserById(savedLink.userId);

        if (user == null) {
          this.logger.log('User not found for userId: ' + savedLink.userId);
          return false;
        }

        if (user.role != UserType.ADMIN) {
          this.logger.log('Role not authorized');
          return false;
        }

        if (link.key === user.apiKey) {
          if (savedLink.openCount >= 3) {
            this.logger.error('User has exceeded allowed link visits');
            await this.linkRepository.softDelete(savedLink.id);
            return false;
          } else {
            if (savedLink.expiry > new Date()) {
              this.logger.log(
                'Successfully validated link for userId: ' + savedLink.userId,
              );
              const openValue = savedLink.openCount + 1;
              await this.linkRepository.update(savedLink.id, {
                openCount: openValue,
              });
              return true; // The link has been validated
            } else {
              this.logger.error('Link has expired');
              return false; // The link has expired
            }
          }
        } else {
          this.logger.log('Api Key is invalid');
          return false;
        }
      }
    } catch (ex) {
      this.logger.error('Exception occurred ' + ex);
      return false;
    }
  }

  async getLinkByToken(token: string): Promise<Link | null> {
    try {
      this.logger.log('Fetching link with token: ' + token);
      return await this.linkRepository.findOneBy({ token });
    } catch (ex) {
      this.logger.error('Exception occurred ' + ex);
      return null;
    }
  }

  async deactivateLink(linkId: string) {
    try {
      await this.linkRepository.softDelete(linkId);
    } catch (ex) {
      this.logger.error(
        'Exception occurred while deactivating link with id:' +
          linkId +
          '\n' +
          ex,
      );
    }
  }
}
