import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '../mail/mail.service';
import { User } from '../users/entities/user.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { OwnerExpenseDto } from './dto/owner-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';
import { ExpensesService } from './expenses.service';

describe('ExpensesService', () => {
  let service: ExpensesService;

  const owner: OwnerExpenseDto = {
    id: '1',
    email: 'lucascdornelas@gmail.com',
    username: 'lucascdornelas',
  };
  const createExpenseDto: CreateExpenseDto = {
    description: 'Almoco com cliente',
    date: new Date('2023-02-11T15:12:00.000Z'),
    value: 215.5,
  };

  const mockSequelizeExpenses = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  const mockSequelizeUsers = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        {
          provide: getModelToken(Expense),
          useValue: mockSequelizeExpenses,
        },
        {
          provide: getModelToken(User),
          useValue: mockSequelizeUsers,
        },
        {
          provide: MailService,
          useClass: MailService,
        },
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new expense and send an email', async () => {
      const payload = { ...createExpenseDto, ownerId: owner.id };

      mockSequelizeExpenses.create.mockReturnValue({ ...payload });

      const spy = jest.spyOn(console, 'log');

      const result = await service.create(createExpenseDto, owner);

      expect(result).toEqual({ ...payload });

      expect(spy).toHaveBeenCalledWith(
        `Email sent to ${owner.email} with subject "Despesa Cadastrada" and text "Olá, ${owner.username}!\nFoi cadastrada uma nova despesa: ${createExpenseDto.description}."`,
      );

      expect(mockSequelizeExpenses.create).toHaveBeenCalledWith(payload);
    });
  });

  describe('findAll', () => {
    it('should return all expenses for the given owner', async () => {
      const expenses = [createExpenseDto];

      mockSequelizeExpenses.findAll.mockResolvedValue(expenses);

      const result = await service.findAll(owner);

      expect(result).toBe(expenses);
      expect(mockSequelizeExpenses.findAll).toHaveBeenCalledWith({
        where: { ownerId: owner.id },
      });
    });
  });

  describe('findOne', () => {
    const id = 1;
    const expense = {
      id: 1,
      ownerId: owner.id,
      ...createExpenseDto,
    };

    it('should throw a UnauthorizedException if the expense does not belong to the user', async () => {
      mockSequelizeExpenses.findOne.mockResolvedValue(expense);

      await expect(
        service.findOne(id, { id: '2', email: '', username: '' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return the expense if it belongs to the user', async () => {
      mockSequelizeExpenses.findOne.mockResolvedValue(expense);

      const result = await service.findOne(1, owner);

      expect(result).toEqual(expense);
    });
  });

  describe('update', () => {
    const id = 1;
    const updateExpenseDto: UpdateExpenseDto = {
      description: 'updated description',
      value: 200,
    };
    const expense = {
      id: 1,
      ownerId: owner.id,
      ...createExpenseDto,
    };

    it('should return updated expense', async () => {
      mockSequelizeExpenses.findOne.mockResolvedValue(expense);
      mockSequelizeExpenses.update.mockResolvedValue([1]);

      const result = await service.update(id, updateExpenseDto, owner);

      expect(mockSequelizeExpenses.update).toBeCalledWith(
        {
          ...updateExpenseDto,
        },
        {
          where: {
            id,
          },
        },
      );
    });

    it('should throw an UnauthorizedException if user id does not match expense owner id', async () => {
      mockSequelizeExpenses.findOne.mockResolvedValue({
        ...expense,
        ownerId: 3,
      });

      try {
        await service.update(id, updateExpenseDto, owner);
        fail('UnauthorizedException was not thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('should throw a NotFoundException if no expenses were updated', async () => {
      mockSequelizeExpenses.findOne.mockResolvedValue(expense);
      mockSequelizeExpenses.update.mockResolvedValue([0]);

      try {
        await service.update(id, updateExpenseDto, owner);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('remove', () => {
    const id = 1;
    const expense = {
      id: 1,
      ownerId: owner.id,
      ...createExpenseDto,
    };
    it('should throw a NotFoundException if the expense is not found', async () => {
      mockSequelizeExpenses.findOne.mockResolvedValue(null);

      try {
        await service.remove(id, owner);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });

    it('should throw an UnauthorizedException if the user is not the owner of the expense', async () => {
      mockSequelizeExpenses.findOne.mockResolvedValue(expense);

      try {
        await service.remove(id, { id: '2', email: '', username: '' });
        fail('UnauthorizedException was not thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('should remove the expense and return a message', async () => {
      mockSequelizeExpenses.findOne.mockResolvedValue(expense);

      const result = await service.remove(id, owner);

      expect(result).toEqual('Record deleted successfully.');
    });
  });
});
