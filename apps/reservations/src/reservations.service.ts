import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './reservations.repository';
import { PAYMENTS_SERVICE } from '@app/common/constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { UserDto } from '@app/common/dto/user.dto';
import { CheckoutSessionCreated } from '@app/common/dto/create-checkout-session.dto';
import {
  PaymentFailedDto,
  PaymentSucceededDto,
} from '@app/common/dto/payment-events.dto';

@Injectable()
export class ReservationsService {
  private readonly logger = new Logger(ReservationsService.name);
  constructor(
    private readonly reservationRepository: ReservationRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentService: ClientProxy,
  ) {}

  async create(createReservationDto: CreateReservationDto, user: UserDto) {
    if (createReservationDto.charge.card) {
      return this.createWithDirectCharge(createReservationDto, user);
    }
    return this.createWithCheckoutSession(createReservationDto, user);
  }

  private async createWithDirectCharge(
    { charge, ...createReservationDto }: CreateReservationDto,
    { email, _id: userId }: UserDto,
  ) {
    const paymentIntent = await lastValueFrom(
      this.paymentService.send<{ id: string }>('charge.create', {
        ...charge,
        email,
      }),
    );

    return this.reservationRepository.create({
      ...createReservationDto,
      amount: charge.amount,
      status: 'confirmed',
      userId,
      invoiceId: paymentIntent.id,
      timestramp: new Date(),
    });
  }

  private async createWithCheckoutSession(
    { charge, ...createReservationDto }: CreateReservationDto,
    { email, _id: userId }: UserDto,
  ) {
    const reservation = await this.reservationRepository.create({
      ...createReservationDto,
      amount: charge.amount,
      timestramp: new Date(),
      userId,
      status: 'pending',
    });

    const session = await lastValueFrom(
      this.paymentService.send<CheckoutSessionCreated>(
        'create.checkout.session',
        {
          amount: charge.amount,
          email,
          reservationId: reservation._id.toHexString(),
        },
      ),
    );

    const updatedReservation =
      await this.reservationRepository.findOneAndUpdate(
        { _id: reservation._id },
        { $set: { checkoutSessionId: session.id } },
      );

    return { ...updatedReservation, paymentUrl: session.url };
  }

  async findAll() {
    return this.reservationRepository.find({});
  }

  async findOne(_id: string) {
    return this.reservationRepository.findOne({ _id });
  }

  async update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  remove(_id: string) {
    return this.reservationRepository.findOneAndDelete({ _id });
  }

  async handlePaymentSucceeded({
    reservationId,
    paymentIntentId,
  }: PaymentSucceededDto) {
    this.logger.log(`Payment succeeded for reservation ${reservationId}`);
    try {
      await this.reservationRepository.findOneAndUpdate(
        {
          _id: reservationId,
        },
        {
          $set: { status: 'confirm', invoiceId: paymentIntentId },
        },
      );
    } catch (err) {
      if (!(err instanceof NotFoundException)) {
        throw err;
      }
      this.logger.warn(
        `Received payment for unknown reservation ${reservationId}`,
      );
    }
  }

  async handlePaymentFailed({ reservationId, reason }: PaymentFailedDto) {
    this.logger.log(
      `Payment failed for reservation ${reservationId}: ${reason}`,
    );
    try {
      await this.reservationRepository.findOneAndUpdate(
        {
          _id: reservationId,
          status: 'pending',
        },
        {
          $set: { status: 'cancelled' },
        },
      );
    } catch (err) {
      if (!(err instanceof NotFoundException)) {
        throw err;
      }
    }
  }
}
