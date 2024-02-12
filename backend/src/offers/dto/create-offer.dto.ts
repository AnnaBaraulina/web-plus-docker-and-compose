import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsInt,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateOfferDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsBoolean()
  hidden: boolean;

  @IsNotEmpty()
  @IsInt()
  itemId: number;
}
