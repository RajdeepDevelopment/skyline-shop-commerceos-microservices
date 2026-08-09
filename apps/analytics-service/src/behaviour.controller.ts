import { Controller, Get, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { BehaviourEvents } from '@app/common';
import type { BehaviourEvent } from '@app/common';
import { ClickHouseService } from './clickhouse.service';

@Controller()
export class BehaviourEventsController {
  private readonly logger = new Logger(BehaviourEventsController.name);

  constructor(private readonly clickhouse: ClickHouseService) {}

  @EventPattern(BehaviourEvents.EVENT)
  async handleEvent(@Payload() event: BehaviourEvent) {
    if (!event?.eventType) return;
    await this.clickhouse.insertEvent(event);
  }

  @Get('analytics/health')
  health() {
    return {
      clickhouse: this.clickhouse.isAvailable,
      ready: this.clickhouse.isAvailable,
    };
  }
}
