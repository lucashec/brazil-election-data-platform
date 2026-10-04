import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TseElectionConfig, TseStateResults, TseMunicipalityListResponse } from '@election/types';
import { TSE_DEFAULT_BASE_URL, padPositionCode, padElectionId } from './tse.constants';

@Injectable()
export class TseClientService {
  private readonly baseUrl: string;
  private readonly logger = new Logger(TseClientService.name);

  constructor(private readonly config: ConfigService) {
    this.baseUrl = this.config.get<string>('TSE_BASE_URL', TSE_DEFAULT_BASE_URL);
  }

  async fetchElectionConfig(year: number): Promise<TseElectionConfig> {
    const url = `${this.baseUrl}/ele${year}/config/ele-c.json`;
    return this.fetchJson<TseElectionConfig>(url);
  }

  async fetchStateResults(
    year: number,
    electionId: string,
    uf: string,
    positionCode: number,
  ): Promise<TseStateResults> {
    const ufLower = uf.toLowerCase();
    const cargo = padPositionCode(positionCode);
    const eleId = padElectionId(electionId);
    const url = `${this.baseUrl}/ele${year}/${electionId}/dados-simplificados/${ufLower}/${ufLower}-c${cargo}-e${eleId}-r.json`;
    return this.fetchJson<TseStateResults>(url);
  }

  async fetchMunicipalityList(
    year: number,
    electionId: string,
    uf: string,
  ): Promise<TseMunicipalityListResponse> {
    const ufLower = uf.toLowerCase();
    const eleId = padElectionId(electionId);
    const url = `${this.baseUrl}/ele${year}/${electionId}/config/${ufLower}/${ufLower}-e${eleId}-mun.json`;
    return this.fetchJson<TseMunicipalityListResponse>(url);
  }

  async fetchMunicipalityResults(
    year: number,
    electionId: string,
    uf: string,
    municipalityCode: string,
    positionCode: number,
  ): Promise<TseStateResults> {
    const ufLower = uf.toLowerCase();
    const cargo = padPositionCode(positionCode);
    const eleId = padElectionId(electionId);
    const url = `${this.baseUrl}/ele${year}/${electionId}/dados-simplificados/${ufLower}/${municipalityCode}/${ufLower}${municipalityCode}-c${cargo}-e${eleId}-r.json`;
    return this.fetchJson<TseStateResults>(url);
  }

  private async fetchJson<T>(url: string, retries = 3): Promise<T> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        this.logger.debug(`Fetching ${url} (attempt ${attempt})`);
        const response = await fetch(url, {
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(15_000),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }

        return (await response.json()) as T;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (attempt === retries) {
          this.logger.error(`Failed to fetch ${url} after ${retries} attempts: ${message}`);
          throw error;
        }
        this.logger.warn(`Attempt ${attempt} failed for ${url}: ${message}. Retrying...`);
        await this.delay(attempt * 1000);
      }
    }
    throw new Error('Unreachable');
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
