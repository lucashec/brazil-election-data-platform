import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { CollectorModule } from './collector.module';

async function bootstrap() {
  const logger = new Logger('CollectorApp');
  const app = await NestFactory.createApplicationContext(CollectorModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  logger.log('Collector application started');

  const shutdown = async () => {
    logger.log('Shutting down...');
    await app.close();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap();
