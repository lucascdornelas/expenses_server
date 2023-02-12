import { IsString } from 'class-validator';

export class OwnerExpenseDto {
  @IsString()
  id: string;

  @IsString()
  email: string;

  @IsString()
  username: string;
}
