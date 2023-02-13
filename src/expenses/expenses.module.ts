import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Expense } from './entities/expense.entity';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [SequelizeModule.forFeature([Expense]), MailModule],
  controllers: [ExpensesController],
  providers: [ExpensesService, JwtStrategy],
})
export class ExpensesModule {}
