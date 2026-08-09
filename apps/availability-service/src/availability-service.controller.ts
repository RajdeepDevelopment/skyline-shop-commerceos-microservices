import { Controller, Get, Post, Param, Query, Body, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { InventoryEvents, InventoryUpdatedEvent } from '@app/common';
import { AvailabilityServiceService } from './availability-service.service';
import { RedisService } from './redis.service';

@Controller()
export class AvailabilityServiceController {
  private readonly logger = new Logger(AvailabilityServiceController.name);

  constructor(
    private readonly availabilityService: AvailabilityServiceService,
    private readonly redis: RedisService,
  ) {}

  @Get('products/:sku/availability')
  async checkAvailability(
    @Param('sku') sku: string,
    @Query('pincode') pincode: string,
    @Query('quantity') quantity?: string,
  ) {
    return this.availabilityService.checkAvailability(
      sku,
      pincode,
      quantity ? parseInt(quantity, 10) : 1,
    );
  }

  @Post('availability/reservations')
  async reserve(@Body() dto: { sku: string; pincode: string; quantity: number; orderId?: string }) {
    return this.availabilityService.reserve(dto.sku, dto.pincode, dto.quantity, dto.orderId);
  }

  @Post('availability/reservations/:id/confirm')
  async confirm(@Param('id') id: string) {
    return this.availabilityService.confirmReservation(id);
  }

  @Post('availability/reservations/:id/release')
  async release(@Param('id') id: string) {
    return this.availabilityService.releaseReservation(id);
  }

  @Get('availability/health')
  health() {
    return { status: 'ok' };
  }

  @EventPattern(InventoryEvents.UPDATED)
  async handleInventoryUpdated(@Payload() data: InventoryUpdatedEvent) {
    if (!data?.sku) return;
    const cleared = await this.availabilityService.invalidateCache(data.sku);
    if (cleared > 0) {
      this.logger.log(
        `Invalidated ${cleared} cache entr${cleared === 1 ? 'y' : 'ies'} for ${data.sku}`,
      );
    }
  }
}
