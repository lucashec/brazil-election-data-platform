import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from '@election/shared';
import { TseModule } from './tse/tse.module';
import { SeedModule } from './seed/seed.module';
import { CollectorRunnerService } from './collector-runner.service';

@Module({
  imports: [
    DatabaseModule,
    ScheduleModule.forRoot(),
    TseModule,
    SeedModule,
  ],
  providers: [CollectorRunnerService],
})
export class CollectorModule {}
