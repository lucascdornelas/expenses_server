import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';

@Table({
  tableName: 'expenses',
})
export class Expense extends Model {
  @Column
  description: string;

  @Column
  date: Date;

  @ForeignKey(() => User)
  @Column({ field: 'USER_ID' })
  ownerId: string;

  @Column
  value: number;
}
