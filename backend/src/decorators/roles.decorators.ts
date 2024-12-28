import { SetMetadata } from '@nestjs/common';
import { UserType } from 'src/common/user-type.enum';

export const ROLE_KEY = 'role';
export const UserRoles = (...role: UserType[]) => SetMetadata(ROLE_KEY, role);
