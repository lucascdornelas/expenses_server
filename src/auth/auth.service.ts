import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const { email, password, phonenumber, username } = createUserDto;

    const salt = await bcrypt.genSalt();

    const userValue = {
      email,
      password: await this.hashPassword(password, salt),
      salt,
      username,
      phonenumber,
    };

    return this.usersService.createUser(userValue);
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.validateLogin({ email, password });

    return user;
  }

  async login(loginUserDto: LoginUserDto) {
    const payload = {
      id: loginUserDto.id,
      email: loginUserDto.email,
      username: loginUserDto.username,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
