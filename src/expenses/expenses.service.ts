import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense)
    private expenseModel: typeof Expense,
  ) {}

  create(createExpenseDto: CreateExpenseDto, ownerId: string) {
    const payload = {
      ...createExpenseDto,
      ownerId: ownerId,
    };

    return this.expenseModel.create(payload);
  }

  findAll() {
    return this.expenseModel.findAll();
  }

  findOne(id: number) {
    return this.expenseModel.findByPk(id);
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto) {
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

  async remove(id: number) {
    const affectedCount = await this.expenseModel.destroy({ where: { id } });

    if (affectedCount === 0) {
      throw new NotFoundException();
    }

    return 'Record deleted successfully.';
  }
}
