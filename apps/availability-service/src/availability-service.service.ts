import {
  Injectable,
  Inject,
  Logger,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient, Warehouse, WarehouseInventory } from '@app/database';
import { EventBusService } from '@app/messaging/event-bus.service';
import { InventoryEvents } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

const CACHE_TTL_SECONDS = 10 * 60;
const UNAVAILABLE_TTL_SECONDS = 2 * 60;

export interface DeliveryInfo {
  days: number;
  expected: string;
  deliveryDate: string;
}

export interface AvailabilityResult {
  available: boolean;
  warehouse?: string;
  delivery?: DeliveryInfo;
  quantityAvailable: boolean;
}

interface BestMatch {
  warehouse: Warehouse;
  inventory: WarehouseInventory;
  serviceability: { priority: number; deliveryDays: number };
}

interface CachedAvailability {
  available: boolean;
  warehouse?: string;
  delivery?: DeliveryInfo;
  quantityAvailable: boolean;
  availableQty?: number;
  reservedQty?: number;
}

@Injectable()
export class AvailabilityServiceService {
  private readonly logger = new Logger(AvailabilityServiceService.name);

  constructor(
    @Inject('PRISMA_CLIENT') private readonly prisma: PrismaClient,
    private readonly redis: RedisService,
    private readonly eventBus: EventBusService,
    private readonly configService: ConfigService,
  ) {}

  private cacheKey(sku: string, pincode: string): string {
    return `availability:${sku}:${pincode}`;
  }

  private reservationTtlMinutes(): number {
    return this.configService.get<number>('RESERVATION_TTL_MIN', 15);
  }

  private computeDelivery(deliveryDays: number, base = new Date()): DeliveryInfo {
    const date = new Date(base);
    date.setDate(date.getDate() + deliveryDays);
    return {
      days: deliveryDays,
      expected:
        deliveryDays <= 1 ? 'tomorrow' : date.toLocaleDateString('en-IN', { weekday: 'long' }),
      deliveryDate: date.toISOString().split('T')[0],
    };
  }

  async checkAvailability(sku: string, pincode: string, quantity = 1): Promise<AvailabilityResult> {
    if (!/^\d{6}$/.test(pincode)) {
      throw new BadRequestException('Pincode must be a 6-digit number');
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new BadRequestException('Quantity must be a positive integer');
    }

    const key = this.cacheKey(sku, pincode);
    const cached = await this.redis.get<CachedAvailability>(key);
    if (cached) {
      if (cached.available && (cached.availableQty ?? 0) - (cached.reservedQty ?? 0) >= quantity) {
        return {
          available: true,
          warehouse: cached.warehouse,
          delivery: cached.delivery,
          quantityAvailable: true,
        };
      }
      if (!cached.available) {
        return { available: false, quantityAvailable: false };
      }
    }

    const best = await this.findBestWarehouse(sku, pincode, quantity);
    if (!best) {
      await this.redis.set(
        key,
        { available: false, quantityAvailable: false },
        UNAVAILABLE_TTL_SECONDS,
      );
      return { available: false, quantityAvailable: false };
    }

    const delivery = this.computeDelivery(best.serviceability.deliveryDays);
    const result: CachedAvailability = {
      available: true,
      warehouse: best.warehouse.name,
      delivery,
      quantityAvailable: true,
      availableQty: best.inventory.availableQuantity,
      reservedQty: best.inventory.reservedQuantity,
    };
    await this.redis.set(key, result, CACHE_TTL_SECONDS);

    return {
      available: true,
      warehouse: best.warehouse.name,
      delivery,
      quantityAvailable: true,
    };
  }

  async findBestWarehouse(
    sku: string,
    pincode: string,
    requestedQty: number,
  ): Promise<BestMatch | null> {
    const serviceability = await this.prisma.pincodeServiceability.findMany({
      where: { pincode, active: true },
      orderBy: { priority: 'asc' },
      include: { warehouse: true },
    });

    for (const mapping of serviceability) {
      const warehouse = mapping.warehouse;
      if (warehouse.status !== 'active') continue;

      const inventory = await this.prisma.warehouseInventory.findUnique({
        where: { sku_warehouseId: { sku, warehouseId: warehouse.id } },
      });
      if (!inventory) continue;

      const free = inventory.availableQuantity - inventory.reservedQuantity;
      if (free >= requestedQty) {
        return { warehouse, inventory, serviceability: mapping };
      }
    }
    return null;
  }

  async reserve(sku: string, pincode: string, quantity: number, orderId?: string) {
    if (!/^\d{6}$/.test(pincode)) {
      throw new BadRequestException('Pincode must be a 6-digit number');
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new BadRequestException('Quantity must be a positive integer');
    }

    const best = await this.findBestWarehouse(sku, pincode, quantity);
    if (!best) {
      throw new ConflictException(
        'Product is not deliverable or has insufficient stock for the requested pincode and quantity',
      );
    }

    const expiryTime = new Date(Date.now() + this.reservationTtlMinutes() * 60 * 1000);
    const [reservation, inventory] = await this.prisma.$transaction([
      this.prisma.inventoryReservation.create({
        data: {
          sku,
          warehouseId: best.warehouse.id,
          quantity,
          orderId: orderId || null,
          status: 'RESERVED',
          expiryTime,
        },
      }),
      this.prisma.warehouseInventory.update({
        where: { sku_warehouseId: { sku, warehouseId: best.warehouse.id } },
        data: { reservedQuantity: { increment: quantity } },
      }),
    ]);

    await this.invalidateCache(sku);

    return {
      reservationId: reservation.id,
      sku,
      warehouse: best.warehouse.name,
      quantity,
      status: reservation.status,
      expiryTime: reservation.expiryTime.toISOString(),
      availableQuantity: inventory.availableQuantity,
    };
  }

  async confirmReservation(reservationId: string) {
    const reservation = await this.prisma.inventoryReservation.findUnique({
      where: { id: reservationId },
    });
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }
    if (reservation.status === 'CONFIRMED') {
      return this.serializeReservation(reservation);
    }
    if (reservation.status !== 'RESERVED') {
      throw new ConflictException(`Reservation is already ${reservation.status.toLowerCase()}`);
    }

    const now = new Date();
    if (now.getTime() > reservation.expiryTime.getTime()) {
      await this.releaseReservation(reservation.id);
      throw new ConflictException('Reservation has expired; stock has been released');
    }

    const [updatedReservation, inventory] = await this.prisma.$transaction([
      this.prisma.inventoryReservation.update({
        where: { id: reservation.id },
        data: { status: 'CONFIRMED' },
      }),
      this.prisma.warehouseInventory.update({
        where: { sku_warehouseId: { sku: reservation.sku, warehouseId: reservation.warehouseId } },
        data: {
          availableQuantity: { decrement: reservation.quantity },
          reservedQuantity: { decrement: reservation.quantity },
        },
      }),
    ]);

    await this.invalidateCache(reservation.sku);
    await this.publishInventoryUpdated(reservation.sku, reservation.warehouseId);

    return {
      reservationId: updatedReservation.id,
      sku: updatedReservation.sku,
      warehouse: (await this.warehouseName(reservation.warehouseId)) ?? undefined,
      status: updatedReservation.status,
      availableQuantity: inventory.availableQuantity,
      reservedQuantity: inventory.reservedQuantity,
    };
  }

  async releaseReservation(reservationId: string) {
    const reservation = await this.prisma.inventoryReservation.findUnique({
      where: { id: reservationId },
    });
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }
    if (reservation.status !== 'RESERVED') {
      return this.serializeReservation(reservation);
    }

    const [updated] = await this.prisma.$transaction([
      this.prisma.inventoryReservation.update({
        where: { id: reservation.id },
        data: { status: 'RELEASED' },
      }),
      this.prisma.warehouseInventory.update({
        where: { sku_warehouseId: { sku: reservation.sku, warehouseId: reservation.warehouseId } },
        data: { reservedQuantity: { decrement: reservation.quantity } },
      }),
    ]);

    await this.invalidateCache(reservation.sku);
    await this.publishInventoryUpdated(reservation.sku, reservation.warehouseId);
    return this.serializeReservation(updated);
  }

  async expireReservations(): Promise<number> {
    const expired = await this.prisma.inventoryReservation.findMany({
      where: {
        status: 'RESERVED',
        expiryTime: { lt: new Date() },
      },
    });

    for (const reservation of expired) {
      try {
        await this.prisma.$transaction([
          this.prisma.inventoryReservation.update({
            where: { id: reservation.id },
            data: { status: 'EXPIRED' },
          }),
          this.prisma.warehouseInventory.update({
            where: {
              sku_warehouseId: { sku: reservation.sku, warehouseId: reservation.warehouseId },
            },
            data: { reservedQuantity: { decrement: reservation.quantity } },
          }),
        ]);
        await this.invalidateCache(reservation.sku);
        await this.publishInventoryUpdated(reservation.sku, reservation.warehouseId);
      } catch (error) {
        this.logger.warn(
          `Failed to expire reservation ${reservation.id}: ${(error as Error).message}`,
        );
      }
    }
    return expired.length;
  }

  async invalidateCache(sku: string): Promise<number> {
    return this.redis.invalidatePattern(`availability:${sku}:*`);
  }

  private async warehouseName(warehouseId: string): Promise<string | null> {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
      select: { name: true },
    });
    return warehouse?.name ?? null;
  }

  private async publishInventoryUpdated(sku: string, warehouseId: string): Promise<void> {
    try {
      const inventory = await this.prisma.warehouseInventory.findUnique({
        where: { sku_warehouseId: { sku, warehouseId } },
      });
      await this.eventBus.publish(InventoryEvents.UPDATED, {
        sku,
        warehouseId,
        availableQuantity: inventory?.availableQuantity ?? 0,
        reservedQuantity: inventory?.reservedQuantity ?? 0,
      });
    } catch (error) {
      this.logger.warn(`Failed to publish ${InventoryEvents.UPDATED}: ${(error as Error).message}`);
    }
  }

  private serializeReservation(reservation: any) {
    return {
      reservationId: reservation.id,
      sku: reservation.sku,
      quantity: reservation.quantity,
      status: reservation.status,
      expiryTime: reservation.expiryTime.toISOString(),
    };
  }
}
