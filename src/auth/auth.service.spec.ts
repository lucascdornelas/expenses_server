import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const user = {
    id: 1,
    email: 'lucascdornelas@gmail.com',
    password: '!nestJS2023#',
    username: 'lucascdornelas',
    phonenumber: '+5531999999999',
  };

  const createUserDto = {
    email: 'lucascdornelas@gmail.com',
    password: '!nestJS2023#',
    username: 'lucascdornelas',
    phonenumber: '+5531999999999',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn().mockResolvedValue(user),
            validateLogin: jest.fn().mockResolvedValue(user),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('access_token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should call usersService.createUser with the correct parameters', async () => {
      const spy = jest.spyOn(usersService, 'createUser');

      await service.signUp(createUserDto);

      expect(spy).toHaveBeenCalledWith({
        email: 'lucascdornelas@gmail.com',
        password: expect.any(String),
        salt: expect.any(String),
        username: 'lucascdornelas',
        phonenumber: '+5531999999999',
      });
    });

    it('should return the correct response', async () => {
      const result = await service.signUp(createUserDto);

      expect(result).toEqual({
        id: 1,
        email: 'lucascdornelas@gmail.com',
        phonenumber: '+5531999999999',
        username: 'lucascdornelas',
      });
    });
  });

  describe('validateUser', () => {
    it('should return a user if email and password are valid', async () => {
      const expectedResult = {
        id: 1,
        email: 'test@example.com',
        password: '!nestJS2023#',
      };

      (usersService.validateLogin as jest.Mock).mockResolvedValue(
        expectedResult,
      );

      const result = await service.validateUser(
        'test@example.com',
        '!nestJS2023#',
      );

      expect(result).toEqual(expectedResult);
    });

    it('should return null if email or password are invalid', async () => {
      (usersService.validateLogin as jest.Mock).mockResolvedValue(null);

      const result = await service.validateUser(
        'test@example.com',
        'wrongpassword',
      );

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access_token', async () => {
      const loginUser = {
        id: 1,
        email: 'lucascdornelas@gmail.com',
        username: 'lucascdornelas',
      };

      const result = await service.login(loginUser as User);

      expect(result).toEqual({
        access_token: 'access_token',
      });
    });
  });
});
