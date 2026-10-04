import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ProcessorModule } from './processor.module';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(ProcessorModule);
  const config = appContext.get(ConfigService);

  const rmqUser = config.get<string>('RABBITMQ_USER', 'election');
  const rmqPass = config.get<string>('RABBITMQ_PASSWORD', 'election_secret');
  const rmqHost = config.get<string>('RABBITMQ_HOST', 'localhost');
  const rmqPort = config.get<number>('RABBITMQ_PORT', 5672);

  await appContext.close();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ProcessorModule, {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${rmqUser}:${rmqPass}@${rmqHost}:${rmqPort}`],
      queue: 'election_events',
      queueOptions: {
        durable: true,
      },
      noAck: false,
    },
  });

  await app.listen();
}

bootstrap();
