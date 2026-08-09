import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StarRatingProps {
  value: number;
  count?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
  starClassName?: string;
}

const sizeMap = {
  xs: { star: 12, text: 'text-xs' },
  sm: { star: 14, text: 'text-xs' },
  md: { star: 16, text: 'text-sm' },
  lg: { star: 20, text: 'text-base' },
};

export function StarRating({
  value,
  count,
  size = 'sm',
  showValue = false,
  className,
  starClassName,
}: StarRatingProps) {
  const rounded = Math.round((Number(value) || 0) * 2) / 2;
  const { star, text } = sizeMap[size];

  return (
    <div
      className={cn('inline-flex items-center gap-1.5', className)}
      role="img"
      aria-label={`Rated ${value} out of 5`}
    >
      <span className={cn('inline-flex items-center gap-0.5', starClassName)}>
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = rounded - i;
          if (filled >= 1) {
            return (
              <Star
                key={i}
                style={{ width: star, height: star }}
                className="fill-amber-400 text-amber-400"
              />
            );
          }
          if (filled >= 0.5) {
            return (
              <span key={i} className="relative inline-block" style={{ width: star, height: star }}>
                <Star
                  className="absolute inset-0 fill-border text-border"
                  style={{ width: star, height: star }}
                />
                <span className="absolute inset-0 overflow-hidden" style={{ width: star * 0.5 }}>
                  <Star
                    className="fill-amber-400 text-amber-400"
                    style={{ width: star, height: star }}
                  />
                </span>
              </span>
            );
          }
          return (
            <Star
              key={i}
              style={{ width: star, height: star }}
              className="fill-border text-border"
            />
          );
        })}
      </span>
      {showValue && (
        <span className={cn('font-semibold text-foreground', text)}>
          {Number(value).toFixed(1)}
        </span>
      )}
      {count != null && count > 0 && (
        <span className={cn('text-muted-foreground', text)}>({count.toLocaleString('en-IN')})</span>
      )}
    </div>
  );
}
