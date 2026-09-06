import {
  IsDefined,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { CardDto } from './card.dto';
import { Type } from 'class-transformer';

export class CreateChargeDto {
  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CardDto)
  card!: CardDto;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount!: number;
}
