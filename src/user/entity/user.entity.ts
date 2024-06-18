import { Roles } from '@prisma/client';

export class UserEntity {
  userId: number;
  email: string;
  role: Roles;
}
