import * as React from 'react';
import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { cn } from '@/lib/utils';

export interface SwitchProps extends React.ComponentProps<typeof BaseSwitch.Root> {
  className?: string;
}

function SwitchPrimitive({ className, ...props }: SwitchProps) {
  return (
    <BaseSwitch.Root
      className={cn(
        'group inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-input transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:bg-primary',
        className,
      )}
      {...props}
    >
      <BaseSwitch.Thumb className="pointer-events-none block size-5 rounded-full bg-background shadow-sm ring-1 ring-border transition-transform duration-200 data-[checked]:translate-x-5 data-[unchecked]:translate-x-0" />
    </BaseSwitch.Root>
  );
}

export { SwitchPrimitive as Switch };
