import {
  BadRequestException,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './reservations.repository';
import { PAYMENTS_SERVICE } from '@app/common/constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentService: ClientProxy,
  ) {}

  async create(createReservationDto: CreateReservationDto, userId: string) {
    const res = await firstValueFrom(
      this.paymentService.send('charge.create', createReservationDto.charge),
    );

    if (res.status !== 'succeeded') {
      throw new UnprocessableEntityException('Payment Fail');
    } else {
      console.log(
        'Payment with id: ' + res.id + ', STATUS[' + res.status + ']',
      );
    }

    return this.reservationRepository.create({
      ...createReservationDto,
      userId,
      invoiceId: res.id,
      timestramp: new Date(),
    });
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
}
