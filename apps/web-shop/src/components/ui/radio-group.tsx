import * as React from 'react';
import { RadioGroup } from '@base-ui/react/radio-group';
import { Radio } from '@base-ui/react/radio';
import { cn } from '@/lib/utils';

export const RadioGroupRoot = RadioGroup;

export function RadioItem({
  className,
  label,
  ...props
}: React.ComponentProps<typeof Radio.Root> & { label?: React.ReactNode }) {
  return (
    <Radio.Root
      className={cn(
        'group inline-flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:opacity-50 data-[checked]:border-primary data-[checked]:bg-primary/5',
        className,
      )}
      {...props}
    >
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-input bg-background transition-colors group-data-[checked]:border-primary group-data-[checked]:bg-primary">
        <Radio.Indicator className="flex size-5 items-center justify-center rounded-full">
          <span className="size-2 rounded-full bg-white" />
        </Radio.Indicator>
      </span>
      {label && <span className="flex-1 text-foreground">{label}</span>}
    </Radio.Root>
  );
}

export { RadioGroup, Radio };
