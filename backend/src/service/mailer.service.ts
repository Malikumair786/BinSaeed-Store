import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { SendEmailDto } from '../dto/mail/send-mail';

@Injectable()
export class MailerService {
  private logger = new Logger(MailerService.name);

  mailTransport() {
    const transporter = nodemailer.createTransport({
      from: process.env.DEFAULT_MAIL_FROM,
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT),
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    return transporter;
  }

  async sendEmail(dto: SendEmailDto) {
    this.logger.log('Sending email with request: ' + JSON.stringify(dto));
    const { from, recipient, subject, text } = dto;
    const transport = this.mailTransport();
    const options: Mail.Options = {
      to: recipient,
      subject,
      text,
    };

    try {
      const result = await transport.sendMail(options);
      this.logger.log(
        'Email with body "' + options.text + '" sent successfully.',
      );
      this.logger.log('Result -> ' + JSON.stringify(result));
    } catch (ex) {
      this.logger.error('Exception while sending email: ' + ex);
    }
  }
}
