import { Table, Column, Model } from 'sequelize-typescript';

@Table({
  tableName: 'expenses',
})
export class Expense extends Model {
  @Column
  description: string;

  @Column
  date: Date;

  @Column
  ownerId: string;

  @Column
  value: number;
}
