import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';

import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  createUser(userValue: CreateUserDto): Promise<User> {
    const payload = { ...userValue };

    return this.userModel.create(payload);
  }

  async validateLogin(loginUserDto: LoginUserDto): Promise<User | null> {
    const { email, password } = loginUserDto;

    const user = await this.userModel.findOne({ where: { email } });

    const isValidPassword = await user.validatePassword(password);

    if (!isValidPassword) {
      return null;
    }

    return user;
  }
}
