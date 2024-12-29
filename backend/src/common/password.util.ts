import * as bcrypt from 'bcrypt';
const saltRounds = 10;
export async function hashPassword(plainTextPassword: string): Promise<string> {
  return bcrypt.hash(plainTextPassword, saltRounds);
}
