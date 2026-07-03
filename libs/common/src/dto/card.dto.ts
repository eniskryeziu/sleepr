import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
  Matches,
  IsCreditCard,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CardDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  cvc!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(12)
  exp_month!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(new Date().getFullYear())
  @Max(new Date().getFullYear() + 20)
  exp_year!: number;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.replace(/\s/g, '') : value,
  )
  @IsString()
  @IsNotEmpty()
  @Length(12, 19)
  @Matches(/^[0-9]+$/, {
    message: 'Card number must contain only digits',
  })
  @IsCreditCard()
  number!: string;
}
