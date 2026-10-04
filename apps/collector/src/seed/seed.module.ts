import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { State, Position } from '@election/shared';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([State, Position])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
