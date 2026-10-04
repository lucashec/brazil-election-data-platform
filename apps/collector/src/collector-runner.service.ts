import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Interval } from '@nestjs/schedule';
import { TseCollectorService } from './tse/tse-collector.service';

@Injectable()
export class CollectorRunnerService implements OnApplicationBootstrap {
  private readonly logger = new Logger(CollectorRunnerService.name);
  private readonly pollIntervalMs: number;
  private running = false;

  constructor(
    private readonly collector: TseCollectorService,
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
      const results = await this.collector.collectAll();
      this.logger.log(`Collection finished: ${results.length} result sets fetched`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Collection failed: ${message}`);
    } finally {
      this.running = false;
    }
  }
}
