import { toPrice } from '@/lib/utils';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';

const sizeMap = {
  sm: { price: 'text-sm', mrp: 'text-xs', off: 'text-xs' },
  md: { price: 'text-base', mrp: 'text-sm', off: 'text-xs' },
  lg: { price: 'text-2xl', mrp: 'text-base', off: 'text-sm' },
} as const;

export interface PriceProps {
  price: number;
  mrp?: number;
  discount?: number;
  size?: keyof typeof sizeMap;
  showSave?: boolean;
  className?: string;
}

/**
 * Consistent price display: discounted price (strongest) + MRP (struck through)
 * + discount percent. Used on cards, listing and detail screens so pricing
 * always renders the same way.
 */
export function Price({
  price,
  mrp,
  discount,
  size = 'md',
  showSave = false,
  className,
}: PriceProps) {
  const rawPrice = toPrice(price);
  const rawMrp = mrp != null ? toPrice(mrp) : 0;
  const rawDiscount = discount != null ? toPrice(discount) : 0;
  const hasMrp = rawMrp > 0 && rawMrp > rawPrice;
  const effectiveDiscount = hasMrp
    ? Math.round(((rawMrp - rawPrice) / rawMrp) * 100)
    : Math.round(rawDiscount);
  const { price: priceCls, mrp: mrpCls, off: offCls } = sizeMap[size];

  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-2 gap-y-0.5', className)}>
      <span className={cn('font-bold text-foreground', priceCls)}>{formatPrice(rawPrice)}</span>
      {hasMrp && (
        <span className={cn('text-muted-foreground line-through', mrpCls)}>
          {formatPrice(rawMrp)}
        </span>
      )}
      {effectiveDiscount > 0 && (
        <span className={cn('font-semibold text-success', offCls)}>
          {effectiveDiscount}% off
          {showSave && hasMrp ? ` · Save ${formatPrice(rawMrp - rawPrice)}` : ''}
        </span>
      )}
    </div>
  );
}
