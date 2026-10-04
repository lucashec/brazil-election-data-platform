import { Injectable, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RABBITMQ_CLIENT } from '@election/shared';
import {
  ELECTION_EVENTS,
  ResultCollectedPayload,
  IngestionCompletedPayload,
  NormalizedCollectionResult,
} from '@election/types';

@Injectable()
export class PublisherService implements OnModuleInit {
  private readonly logger = new Logger(PublisherService.name);

  constructor(
    @Inject(RABBITMQ_CLIENT) private readonly client: ClientProxy,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.client.connect();
      this.logger.log('Connected to RabbitMQ');
    } catch (error) {
      this.logger.warn('RabbitMQ not available, events will be queued');
    }
  }

  async publishResultCollected(result: NormalizedCollectionResult): Promise<void> {
    const payload: ResultCollectedPayload = {
      collectedAt: new Date().toISOString(),
      electionTseId: result.election.tseId,
      positionTseCode: result.totalization.positionTseCode,
      uf: result.totalization.uf,
      data: result,
    };

    this.client.emit(ELECTION_EVENTS.RESULT_COLLECTED, payload);
    this.logger.debug(
      `Published ${ELECTION_EVENTS.RESULT_COLLECTED}: ${payload.uf}/${payload.positionTseCode}`,
    );
  }

  async publishIngestionCompleted(
    electionYear: number,
    totalResultSets: number,
    totalCandidates: number,
  ): Promise<void> {
    const payload: IngestionCompletedPayload = {
      completedAt: new Date().toISOString(),
      electionYear,
      totalResultSets,
      totalCandidates,
    };

    this.client.emit(ELECTION_EVENTS.INGESTION_COMPLETED, payload);
    this.logger.log(`Published ${ELECTION_EVENTS.INGESTION_COMPLETED}: year=${electionYear}`);
  }
}
