import { NestFactory } from '@nestjs/core';
import { CollectorModule } from './collector.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(CollectorModule);
  await app.init();
}

bootstrap();
