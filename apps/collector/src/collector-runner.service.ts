import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Interval } from '@nestjs/schedule';
import { NormalizedCollectionResult } from '@election/types';
import { TseCollectorService } from './tse/tse-collector.service';
import { NormalizerService } from './normalizer/normalizer.service';
import { PublisherService } from './publisher/publisher.service';

@Injectable()
export class CollectorRunnerService implements OnApplicationBootstrap {
  private readonly logger = new Logger(CollectorRunnerService.name);
  private readonly pollIntervalMs: number;
  private running = false;

  constructor(
    private readonly collector: TseCollectorService,
    private readonly normalizer: NormalizerService,
    private readonly publisher: PublisherService,
    private readonly config: ConfigService,
  ) {
    this.pollIntervalMs = this.config.get<number>('TSE_POLL_INTERVAL_MS', 0);
  }

  async onApplicationBootstrap(): Promise<void> {
    this.logger.log('Running initial collection...');
    await this.run();

    if (this.pollIntervalMs > 0) {
      this.logger.log(`Polling enabled every ${this.pollIntervalMs}ms`);
    } else {
      this.logger.log('Polling disabled (set TSE_POLL_INTERVAL_MS to enable)');
    }
  }

  @Interval('tse-poll', 60_000)
  async handleInterval(): Promise<void> {
    if (this.pollIntervalMs <= 0) return;
    await this.run();
  }

  private async run(): Promise<void> {
    if (this.running) {
      this.logger.warn('Collection already in progress, skipping');
      return;
    }

    this.running = true;
    try {
      const collected = await this.collector.collectAll();
      const normalized = this.normalizer.normalizeMany(collected);
      await this.publishResults(normalized);
      this.logNormalizationSummary(normalized);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Collection failed: ${message}`);
    } finally {
      this.running = false;
    }
  }

  private async publishResults(results: NormalizedCollectionResult[]): Promise<void> {
    for (const result of results) {
      await this.publisher.publishResultCollected(result);
    }

    const totalCandidates = results.reduce((sum, r) => sum + r.candidates.length, 0);
    if (results.length > 0) {
      await this.publisher.publishIngestionCompleted(
        results[0].election.year,
        results.length,
        totalCandidates,
      );
    }
  }

  private logNormalizationSummary(results: NormalizedCollectionResult[]): void {
    const totalCandidates = results.reduce((sum, r) => sum + r.candidates.length, 0);
    const totalParties = new Set(results.flatMap((r) => r.parties.map((p) => p.number))).size;
    const totalVotingResults = results.reduce((sum, r) => sum + r.votingResults.length, 0);

    this.logger.log(
      `Normalized ${results.length} result sets: ${totalCandidates} candidates, ${totalParties} parties, ${totalVotingResults} voting results`,
    );
  }
}
