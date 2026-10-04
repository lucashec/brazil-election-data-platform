import { Module, DynamicModule } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const RABBITMQ_CLIENT = 'RABBITMQ_CLIENT';

@Module({})
export class MessagingModule {
  static register(): DynamicModule {
    return {
      module: MessagingModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: RABBITMQ_CLIENT,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [
                  `amqp://${config.get<string>('RABBITMQ_USER', 'election')}:${config.get<string>('RABBITMQ_PASSWORD', 'election_secret')}@${config.get<string>('RABBITMQ_HOST', 'localhost')}:${config.get<number>('RABBITMQ_PORT', 5672)}`,
                ],
                queue: 'election_events',
                queueOptions: {
                  durable: true,
                },
                noAck: false,
              },
            }),
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
