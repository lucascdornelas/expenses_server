import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { getModelToken } from '@nestjs/sequelize';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  const mockSequelizeUsers = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User),
          useValue: mockSequelizeUsers,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'lucascdornelas@gmail.com',
        password: '!nestJS2023#',
        username: 'lucascdornelas',
        phonenumber: '+5531999999999',
      };

      jest.spyOn(mockSequelizeUsers, 'create').mockResolvedValue(createUserDto);
      expect(await service.createUser(createUserDto)).toEqual(createUserDto);
    });
  });

  describe('validateLogin', () => {
    it('should return user when login is valid', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'lucascdornelas@gmail.com',
        password: '!nestJS2023#',
      };

      const user = {
        id: '1',
        email: loginUserDto.email,
        username: 'lucascdornelas',
        validatePassword: jest.fn().mockReturnValue(true),
      };

      jest.spyOn(mockSequelizeUsers, 'findOne').mockResolvedValue(user);

      expect(await service.validateLogin(loginUserDto)).toEqual(user);
    });

    it('should return null when login is invalid', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'lucascdornelas@gmail.com',
        password: '!nestJS2023#',
      };

      const user = {
        id: '1',
        email: loginUserDto.email,
        username: 'lucascdornelas',
        validatePassword: jest.fn().mockReturnValue(false),
      };

      jest.spyOn(mockSequelizeUsers, 'findOne').mockResolvedValue(user);

      expect(await service.validateLogin(loginUserDto)).toBeNull();
    });
  });
});
