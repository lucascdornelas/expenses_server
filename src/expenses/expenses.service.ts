import { Injectable } from '@nestjs/common';
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

  create(createExpenseDto: CreateExpenseDto) {
    return this.expenseModel.create(createExpenseDto as any);
  }

  findAll() {
    return this.expenseModel.findAll();
  }

  findOne(id: number) {
    return this.expenseModel.findByPk(id);
  }

  update(id: number, updateExpenseDto: UpdateExpenseDto) {
    return this.expenseModel.update(updateExpenseDto, {
      where: {
        id,
      },
    });
  }

  remove(id: number) {
    return this.expenseModel.destroy({ where: { id } });
  }
}
