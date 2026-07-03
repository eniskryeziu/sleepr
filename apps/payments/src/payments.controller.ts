import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateChargeDto } from '@app/common/dto/create-charge.dto';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('charge.create')
  @UsePipes(new ValidationPipe())
  async create(@Payload() data: CreateChargeDto) {
    return this.paymentsService.createCharge(data);
  }
}
