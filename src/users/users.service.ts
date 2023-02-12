import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
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

    return this.userModel.create(userValue);
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  findAll() {
    return this.userModel.findAll();
  }

  async signIn(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userModel.findOne({ where: { email } });

    console.log(user);

    if (await user.validatePassword(password)) {
      return 'login success!';
    }
  }
}
