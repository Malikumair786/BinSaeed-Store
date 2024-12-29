import { Address } from 'nodemailer/lib/mailer';

export type SendEmailDto = {
  from?: Address;
  recipient: Address;
  subject: string;
  text: string;
};
