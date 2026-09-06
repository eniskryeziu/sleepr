import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useLogger(app.get(Logger));
  const configService = app.get(ConfigService);
  const http_port = configService.get<number>('HTTP_PORT');
  if (http_port === undefined) {
    throw new Error('PORT is not defined');
  }
  const tcp_port = configService.get<number>('TCP_PORT');
  if (tcp_port === undefined) {
    throw new Error('PORT is not defined');
  }
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: tcp_port,
    },
  });
  await app.startAllMicroservices();
  await app.listen(http_port);
}
bootstrap();
