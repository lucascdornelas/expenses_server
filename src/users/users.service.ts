import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { SignInResponseDto } from './dto/signin-response.dto';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
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

    return this.userModel.create(userValue);
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async signIn(loginUserDto: LoginUserDto): Promise<SignInResponseDto> {
    const { email, password } = loginUserDto;

    const user = await this.userModel.findOne({ where: { email } });

    const isValidPassword = await user.validatePassword(password);

    if (!isValidPassword) {
      throw new UnauthorizedException({}, 'Invalid Credentials!');
    }

    const accessToken = await this.jwtService.sign({ user });

    const singInResponse: SignInResponseDto = {
      access_token: accessToken,
      user: user,
    };

    return singInResponse;
  }

  async validateAccessToken(token: string) {
    let decoded = null;

    try {
      decoded = this.jwtService.verify(token);

      console.log(decoded);

      if (decoded) {
        return true;
      }
    } catch (error) {
      console.log(decoded, token);
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  findAll() {
    return this.userModel.findAll();
  }
}
