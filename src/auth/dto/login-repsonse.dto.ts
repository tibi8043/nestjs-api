import { User } from 'src/users/interfaces/user.entity';

export type LoginResponseDto = {
  access_token: string;
  user: User;
};
