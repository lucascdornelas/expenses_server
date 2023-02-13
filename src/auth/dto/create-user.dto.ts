import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword, IsString } from 'class-validator';

export class CreateUserDto {
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

  @ApiProperty({
    description: 'user name',
    example: 'lucascdornelas',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'user phone number',
    example: '+5531999999999',
  })
  @IsString()
  phonenumber: string;
}
