import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule, { rawBody: true });
  const configService = app.get(ConfigService);
  const tcpPort = configService.get<number>('TCP_PORT', 3001);
  const httpPort = configService.get<number>('HTTP_PORT', 3000);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: tcpPort,
    },
  });
  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
  await app.listen(httpPort);
}

bootstrap();
