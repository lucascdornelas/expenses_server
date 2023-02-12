import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsDateString,
  MaxLength,
  IsPositive,
} from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({
    description: 'expense description',
    example: 'Almoco com cliente',
  })
  @IsString()
  @MaxLength(191)
  description: string;

  @ApiProperty({
    description: 'expense date',
    example: '2023-02-11T15:12:00.000Z',
  })
  @IsDateString()
  date: Date;

  @ApiProperty({
    description: 'expense amount in Real',
    example: 180.7,
  })
  @IsNumber()
  @IsPositive()
  value: number;
}
