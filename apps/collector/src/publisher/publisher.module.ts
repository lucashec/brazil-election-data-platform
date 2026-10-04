import { Module } from '@nestjs/common';
import { MessagingModule } from '@election/shared';
import { PublisherService } from './publisher.service';

@Module({
  imports: [MessagingModule.register()],
  providers: [PublisherService],
  exports: [PublisherService],
})
export class PublisherModule {}
