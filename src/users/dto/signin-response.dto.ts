import { IsString } from 'class-validator';
import { User } from '../entities/user.entity';

export class SignInResponseDto {
  @IsString()
  access_token: string;

  user: User;
}
