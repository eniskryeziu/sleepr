import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { Logger } from 'nestjs-pino';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(NotificationsModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: process.env.PORT || 3004,
    },
  });

  app.useLogger(app.get(Logger));
  await app.listen();
}
bootstrap();
