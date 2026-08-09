import * as React from 'react';
import { Progress as BaseProgress } from '@base-ui/react/progress';
import { cn } from '@/lib/utils';

export interface ProgressProps extends Omit<
  React.ComponentProps<typeof BaseProgress.Root>,
  'value'
> {
  value?: number | null;
  className?: string;
  indicatorClassName?: string;
}

function ProgressBar({
  value = 0,
  max = 100,
  className,
  indicatorClassName,
  ...props
}: ProgressProps) {
  return (
    <BaseProgress.Root
      value={value}
      max={max}
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-accent', className)}
      {...props}
    >
      <BaseProgress.Indicator
        className={cn(
          'h-full rounded-full bg-primary transition-[width] duration-300 ease-out',
          indicatorClassName,
        )}
      />
    </BaseProgress.Root>
  );
}

export { ProgressBar as Progress };
