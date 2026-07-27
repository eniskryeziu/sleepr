import { Injectable } from '@nestjs/common';
import { NotificationDto } from './dto/notification.dto';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class NotificationsService {
  private readonly transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get('SMTP_USER'),
        clientId: this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
        clientSecret: this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
        refreshToken: this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
      },
    });
  }

  async notifyEmail(data: NotificationDto) {
    await this.transporter.sendMail({
      from: this.configService.get('SMTP_USER'),
      to: data.email,
      subject: 'Sleepr Notification',
      text: data.text,
    });
  }
}
