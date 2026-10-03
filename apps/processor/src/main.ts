import { NestFactory } from '@nestjs/core';
import { ProcessorModule } from './processor.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(ProcessorModule);
  await app.init();
}

bootstrap();
