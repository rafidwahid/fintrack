import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  cardId: string;

  @IsDateString()
  date: string;
}

export class UpdateTransactionDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  cardId?: string;

  @IsDateString()
  @IsOptional()
  date?: string;
}
