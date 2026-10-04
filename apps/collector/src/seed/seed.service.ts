import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { State, Position } from '@election/shared';
import { BRAZILIAN_STATES, ELECTORAL_POSITIONS } from '../tse/tse.constants';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(State) private readonly stateRepo: Repository<State>,
    @InjectRepository(Position) private readonly positionRepo: Repository<Position>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedStates();
    await this.seedPositions();
  }

  private async seedStates(): Promise<void> {
    for (const stateData of BRAZILIAN_STATES) {
      const existing = await this.stateRepo.findOne({ where: { code: stateData.code } });
      if (!existing) {
        await this.stateRepo.save(this.stateRepo.create(stateData));
      }
    }
    this.logger.log(`States seeded: ${BRAZILIAN_STATES.length} entries`);
  }

  private async seedPositions(): Promise<void> {
    for (const posData of ELECTORAL_POSITIONS) {
      const existing = await this.positionRepo.findOne({ where: { tseCode: posData.tseCode } });
      if (!existing) {
        await this.positionRepo.save(this.positionRepo.create(posData));
      }
    }
    this.logger.log(`Positions seeded: ${ELECTORAL_POSITIONS.length} entries`);
  }
}
