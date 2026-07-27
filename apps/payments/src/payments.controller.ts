import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UsePipes(new ValidationPipe())
  @MessagePattern('charge.create')
  async create(@Payload() data: PaymentsCreateChargeDto) {
    return this.paymentsService.createCharge(data);
  }
}
