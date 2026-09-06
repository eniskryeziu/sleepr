import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';
import { CreateCheckoutSessionDto } from '@app/common/dto/create-checkout-session.dto';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UsePipes(new ValidationPipe())
  @MessagePattern('charge.create')
  async create(@Payload() data: PaymentsCreateChargeDto) {
    return this.paymentsService.createCharge(data);
  }

  @MessagePattern('create.checkout.session')
  @UsePipes(new ValidationPipe())
  async createCheckoutSession(@Payload() data: CreateCheckoutSessionDto) {
    return this.paymentsService.createCheckoutSession(data);
  }
}
