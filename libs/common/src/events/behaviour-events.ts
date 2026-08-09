export enum BehaviourEventType {
  PRODUCT_VIEW = 'PRODUCT_VIEW',
  SEARCH = 'SEARCH',
  SEARCH_CLICK = 'SEARCH_CLICK',
  PRODUCT_CLICK = 'PRODUCT_CLICK',
  ADD_TO_CART = 'ADD_TO_CART',
  REMOVE_FROM_CART = 'REMOVE_FROM_CART',
  WISHLIST_ADD = 'WISHLIST_ADD',
  PURCHASE = 'PURCHASE',
  PRODUCT_SHARE = 'PRODUCT_SHARE',
  REVIEW_CREATED = 'REVIEW_CREATED',
  RETURN_PRODUCT = 'RETURN_PRODUCT',
  IMPRESSION = 'IMPRESSION',
}

export interface BehaviourEvent {
  eventType: BehaviourEventType;
  userId?: string;
  sessionId?: string;
  productId?: string;
  category?: string;
  quantity?: number;
  payload?: Record<string, unknown>;
  timestamp?: string;
}

export const BehaviourEvents = {
  EVENT: 'behaviour.event',
} as const;

export const PRODUCT_LEVEL_EVENT_TYPES: ReadonlySet<BehaviourEventType> = new Set([
  BehaviourEventType.PRODUCT_VIEW,
  BehaviourEventType.PRODUCT_CLICK,
  BehaviourEventType.SEARCH_CLICK,
  BehaviourEventType.ADD_TO_CART,
  BehaviourEventType.REMOVE_FROM_CART,
  BehaviourEventType.WISHLIST_ADD,
  BehaviourEventType.PURCHASE,
  BehaviourEventType.PRODUCT_SHARE,
  BehaviourEventType.REVIEW_CREATED,
  BehaviourEventType.RETURN_PRODUCT,
  BehaviourEventType.IMPRESSION,
]);

export class ProductViewedEvent {
  constructor(
    public readonly productId: string,
    public readonly userId: string | undefined,
    public readonly occurredAt: string,
  ) {}
}
