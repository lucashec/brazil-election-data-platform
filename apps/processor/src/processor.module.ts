import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule, Election, Party, Candidate, Position, State } from '@election/shared';
import { ResultCollectedHandler } from './handlers/result-collected.handler';
import { ResultProcessorService } from './services/result-processor.service';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Election, Party, Candidate, Position, State]),
  ],
  controllers: [ResultCollectedHandler],
  providers: [ResultProcessorService],
})
export class ProcessorModule {}
