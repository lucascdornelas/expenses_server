import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MailService } from '../mail/mail.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { OwnerExpenseDto } from './dto/owner-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense)
    private expenseModel: typeof Expense,
    private mailService: MailService,
  ) {}

  async create(createExpenseDto: CreateExpenseDto, owner: OwnerExpenseDto) {
    const ownerId = owner.id;

    const payload = {
      ...createExpenseDto,
      ownerId: ownerId,
    };

    await this.mailService.sendEmail(
      owner.email,
      'Despesa Cadastrada',
      `Olá, ${owner.username}!\nFoi cadastrada uma nova despesa: ${createExpenseDto.description}.`,
    );

    return this.expenseModel.create(payload);
  }

  findAll(user: OwnerExpenseDto) {
    return this.expenseModel.findAll({ where: { ownerId: user.id } });
  }

  async findOne(id: number, user: OwnerExpenseDto) {
    const expense = await this.expenseModel.findOne({ where: { id } });

    if (expense.ownerId != user.id) {
      throw new UnauthorizedException();
    }

    return expense;
  }

  async update(
    id: number,
    updateExpenseDto: UpdateExpenseDto,
    user: OwnerExpenseDto,
  ) {
    const expense = await this.expenseModel.findOne({ where: { id } });

    if (expense.ownerId != user.id) {
      throw new UnauthorizedException();
    }

    const [affectedCount] = await this.expenseModel.update(updateExpenseDto, {
      where: {
        id,
      },
    });

    if (affectedCount === 0) {
      throw new NotFoundException();
    }

    return this.expenseModel.findByPk(id);
  }

  async remove(id: number, user: OwnerExpenseDto) {
    const expense = await this.expenseModel.findOne({ where: { id } });

    if (expense.ownerId != user.id) {
      throw new UnauthorizedException();
    }

    const affectedCount = await this.expenseModel.destroy({ where: { id } });

    if (affectedCount === 0) {
      throw new NotFoundException();
    }

    return 'Record deleted successfully.';
  }
}
