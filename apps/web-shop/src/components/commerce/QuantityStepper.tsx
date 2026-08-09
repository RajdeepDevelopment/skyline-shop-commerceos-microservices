import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
  ariaLabel?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  className,
  ariaLabel = 'Quantity',
}: QuantityStepperProps) {
  const btn = size === 'sm' ? 'size-7' : 'size-9';
  const text = size === 'sm' ? 'min-w-8 text-sm' : 'min-w-10 text-sm';

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-xl border border-border bg-background-elevated/60',
        className,
      )}
      role="group"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={cn(
          'flex items-center justify-center rounded-l-xl text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-40',
          btn,
        )}
        aria-label="Decrease quantity"
      >
        <Minus className="size-4" />
      </button>
      <span
        className={cn(
          'flex items-center justify-center font-semibold tabular-nums text-foreground',
          text,
        )}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn(
          'flex items-center justify-center rounded-r-xl text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-40',
          btn,
        )}
        aria-label="Increase quantity"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
