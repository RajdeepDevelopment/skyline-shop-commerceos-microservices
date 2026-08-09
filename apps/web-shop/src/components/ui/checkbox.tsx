import * as React from 'react';
import { Checkbox } from '@base-ui/react/checkbox';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends React.ComponentProps<typeof Checkbox.Root> {
  className?: string;
}

export const CheckboxPrimitive = Checkbox;

export function CheckboxItem({ className, ...props }: CheckboxProps) {
  return (
    <Checkbox.Root
      className={cn(
        'group flex size-5 shrink-0 items-center justify-center rounded border border-input bg-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:border-primary data-[checked]:bg-primary',
        className,
      )}
      {...props}
    >
      <Checkbox.Indicator>
        <Check className="size-3.5 text-primary-foreground" />
      </Checkbox.Indicator>
    </Checkbox.Root>
  );
}

export { Checkbox };
