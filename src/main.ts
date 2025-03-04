import { loadEnvironment } from './infrastructure/shared/utils/loadEnvironment';
loadEnvironment();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { config } from './infrastructure/config/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Transport } from '@nestjs/microservices';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.connectMicroservice(
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [
            `${config.kafka.kafka1HostExternal}:${config.kafka.kafka1DockerPort}`,
          ],
          connectionTimeout: 10000,
        },
        consumer: {
          groupId: config.kafka.consumerGroup,
        },
      },
    },
    { inheritAppConfig: true },
  );
  await app.startAllMicroservices();

  const document = new DocumentBuilder()
    .setTitle('Warehousing (nestjs-event-sourcing)')
    .setDescription('Api for the warehousing event-sourced app example')
    .setVersion('1.0.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, document);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors({ origin: ['http://localhost:3000'] });

  await app.listen(config.server.port);
}
bootstrap();
