import {
  IsString,
  IsNumber,
  IsDateString,
  MaxLength,
  IsPositive,
} from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  @MaxLength(191)
  description: string;

  @IsDateString()
  date: Date;

  @IsString()
  ownerId: string;

  @IsNumber()
  @IsPositive()
  value: number;
}
