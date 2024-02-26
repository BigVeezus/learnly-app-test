import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class TransferDTO {
  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(100)
  amount: number;

  @IsNotEmpty()
  @IsString()
  recipientAccount: string;
}
