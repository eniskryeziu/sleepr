import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { JwtAuthGuard } from '@app/common/auth/jwt-auth.guard';
import { CurrentUser } from '@app/common/decorators/current-user.decorator';
import type { UserDto } from '@app/common/dto/user.dto';
import { Roles } from '@app/common/decorators/roles.decorator';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  PAYMENT_FAILED_EVENT,
  PAYMENT_SUCCEEDED_EVENT,
  PaymentFailedDto,
  PaymentSucceededDto,
} from '@app/common/dto/payment-events.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.reservationsService.create(createReservationDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(id, updateReservationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  async remove(@Param('id') id: string) {
    return this.reservationsService.remove(id);
  }

  @EventPattern(PAYMENT_SUCCEEDED_EVENT)
  @UsePipes(new ValidationPipe())
  async handlePaymentSucceeded(
    @Payload() payload: PaymentSucceededDto,
  ): Promise<void> {
    await this.reservationsService.handlePaymentSucceeded(payload);
  }

  @EventPattern(PAYMENT_FAILED_EVENT)
  @UsePipes(new ValidationPipe())
  async handlePaymentFailed(
    @Payload() payload: PaymentFailedDto,
  ): Promise<void> {
    await this.reservationsService.handlePaymentFailed(payload);
  }
}
