import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TseElectionConfig, TsePleito, TseStateResults } from '@election/types';
import { TseClientService } from './tse-client.service';
import { BRAZILIAN_STATES, ELECTORAL_POSITIONS } from './tse.constants';

export interface CollectedResult {
  pleito: TsePleito;
  uf: string;
  positionCode: number;
  data: TseStateResults;
}

@Injectable()
export class TseCollectorService implements OnModuleInit {
  private readonly logger = new Logger(TseCollectorService.name);
  private readonly year: number;
  private readonly positionCodes: number[];

  constructor(
    private readonly tseClient: TseClientService,
    private readonly config: ConfigService,
  ) {
    this.year = this.config.get<number>('TSE_ELECTION_YEAR', 2024);
    const codes = this.config.get<string>('TSE_POSITION_CODES', '');
    this.positionCodes = codes
      ? codes.split(',').map(Number)
      : ELECTORAL_POSITIONS.map((p) => p.tseCode);
  }

  async onModuleInit(): Promise<void> {
    this.logger.log(`Collector initialized for year ${this.year}`);
  }

  async collectAll(): Promise<CollectedResult[]> {
    this.logger.log(`Starting collection for year ${this.year}`);

    const electionConfig = await this.fetchElectionConfig();
    if (!electionConfig) return [];

    const results: CollectedResult[] = [];

    for (const pleito of electionConfig.pl) {
      const pleitoResults = await this.collectPleito(pleito);
      results.push(...pleitoResults);
    }

    this.logger.log(`Collection complete. Total results fetched: ${results.length}`);
    return results;
  }

  async fetchElectionConfig(): Promise<TseElectionConfig | null> {
    try {
      const config = await this.tseClient.fetchElectionConfig(this.year);
      this.logger.log(`Found ${config.pl.length} election(s) for year ${this.year}`);
      return config;
    } catch (error) {
      this.logger.error(`Failed to fetch election config for year ${this.year}`);
      return null;
    }
  }

  private async collectPleito(pleito: TsePleito): Promise<CollectedResult[]> {
    this.logger.log(`Collecting pleito ${pleito.cd} (round ${pleito.t}, type ${pleito.tpab})`);
    const results: CollectedResult[] = [];
    const positions = this.getPositionsForElectionType(pleito.tpab);

    for (const position of positions) {
      for (const state of BRAZILIAN_STATES) {
        try {
          const data = await this.tseClient.fetchStateResults(
            this.year,
            pleito.cd,
            state.code,
            position.tseCode,
          );
          results.push({ pleito, uf: state.code, positionCode: position.tseCode, data });
          this.logger.debug(
            `${state.code} - ${position.name}: ${data.s.pst}% apurado, ${data.cand.length} candidatos`,
          );
        } catch {
          this.logger.warn(
            `No data for ${state.code} - ${position.name} in pleito ${pleito.cd}`,
          );
        }
      }
    }

    return results;
  }

  private getPositionsForElectionType(type: string): typeof ELECTORAL_POSITIONS {
    const typeLower = type.toLowerCase();
    return ELECTORAL_POSITIONS.filter((p) => {
      if (this.positionCodes.length > 0 && !this.positionCodes.includes(p.tseCode)) {
        return false;
      }
      if (typeLower.includes('municipal')) {
        return p.scope === 'municipal';
      }
      return p.scope === 'federal' || p.scope === 'state';
    });
  }
}
