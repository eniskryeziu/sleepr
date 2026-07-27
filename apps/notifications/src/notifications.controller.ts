import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationDto } from './dto/notification.dto';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UsePipes(new ValidationPipe())
  @EventPattern('reservation.created')
  async handleReservationCreated(@Payload() data: NotificationDto) {
    await this.notificationsService.notifyEmail(data);
  }
}
