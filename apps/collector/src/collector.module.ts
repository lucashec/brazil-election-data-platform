import { Module } from '@nestjs/common';
import { DatabaseModule } from '@election/shared';

@Module({
  imports: [DatabaseModule],
})
export class CollectorModule {}
