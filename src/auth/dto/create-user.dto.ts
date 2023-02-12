import { IsEmail, IsStrongPassword, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsString()
  username: string;

  @IsString()
  phonenumber: string;
}
