import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Expense } from './entities/expense.entity';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [SequelizeModule.forFeature([Expense])],
  controllers: [ExpensesController],
  providers: [ExpensesService, JwtStrategy],
})
export class ExpensesModule {}
