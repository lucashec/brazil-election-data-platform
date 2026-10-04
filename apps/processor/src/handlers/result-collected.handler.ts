import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { ELECTION_EVENTS, ResultCollectedPayload } from '@election/types';
import { ResultProcessorService } from '../services/result-processor.service';

@Controller()
export class ResultCollectedHandler {
  private readonly logger = new Logger(ResultCollectedHandler.name);

  constructor(private readonly processor: ResultProcessorService) {}

  @EventPattern<string>(ELECTION_EVENTS.RESULT_COLLECTED)
  async handle(
    @Payload() payload: ResultCollectedPayload,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    this.logger.log(
      `Processing result: election=${payload.electionTseId} position=${payload.positionTseCode} uf=${payload.uf}`,
    );

    try {
      await this.processor.process(payload);
      channel.ack(message);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to process result: ${errorMsg}`);
      channel.nack(message, false, true);
    }
  }
}
