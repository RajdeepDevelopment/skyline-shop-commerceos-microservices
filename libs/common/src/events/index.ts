export * from './behaviour-events';

export enum OrderEvents {
  CREATED = 'order.created',
  CONFIRMED = 'order.confirmed',
  CANCELLED = 'order.cancelled',
}

export enum InventoryEvents {
  RESERVED = 'inventory.reserved',
  RELEASED = 'inventory.released',
  OUT_OF_STOCK = 'inventory.out_of_stock',
  UPDATED = 'inventory.updated',
}

export enum PaymentEvents {
  SUCCESS = 'payment.success',
  FAILED = 'payment.failed',
}

export class OrderCreatedEvent {
  orderId!: string;
  userId!: string;
  items!: Array<{ productId: string; quantity: number; price: number }>;
  totalAmount!: number;
}

export class StockReservedEvent {
  orderId!: string;
  userId!: string;
}

export class PaymentSuccessEvent {
  orderId!: string;
  paymentId!: string;
}

export class InventoryUpdatedEvent {
  sku!: string;
  warehouseId!: string;
  availableQuantity!: number;
  reservedQuantity!: number;
}
