import { Module } from '@nestjs/common';
import { TseClientService } from './tse-client.service';
import { TseCollectorService } from './tse-collector.service';

@Module({
  providers: [TseClientService, TseCollectorService],
  exports: [TseCollectorService, TseClientService],
})
export class TseModule {}
