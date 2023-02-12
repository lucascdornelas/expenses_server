import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';

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

    const result = await this.usersService.createUser(userValue);

    return { id: result.id, email, phonenumber, username };
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.validateLogin({ email, password });

    return user;
  }

  async login(loginUser: User) {
    const payload = {
      id: loginUser.id,
      email: loginUser.email,
      username: loginUser.username,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
