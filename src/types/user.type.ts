import { UserType } from './user-type.enum';

export type User = {
  name: string;
  email: string;
  picture?: string;
  password: string;
  role: UserType
}
