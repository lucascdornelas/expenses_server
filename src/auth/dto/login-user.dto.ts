import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'user email',
    example: 'lucascdornelas@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'user password',
    example: '!nestJS2023#',
  })
  @IsStrongPassword()
  password: string;
}
