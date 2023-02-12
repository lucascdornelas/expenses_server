import { Table, Column, Model } from 'sequelize-typescript';

import * as bcrypt from 'bcrypt';

@Table({
  tableName: 'users',
})
export class User extends Model {
  @Column({ unique: true })
  email: string;

  @Column
  password: string;

  @Column
  salt: string;

  @Column
  username: string;

  @Column
  phonenumber: string;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
