import * as React from 'react';
import { Select } from '@base-ui/react/select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SelectRoot = Select.Root;

export type SelectValueProps = React.ComponentProps<typeof Select.Value>;

export function SelectValue({ placeholder, children, ...props }: SelectValueProps) {
  return (
    <Select.Value placeholder={placeholder} {...props}>
      {(state) =>
        children
          ? typeof children === 'function'
            ? children(state)
            : children
          : state.value || placeholder
      }
    </Select.Value>
  );
}

export interface SelectTriggerProps extends Omit<
  React.ComponentProps<typeof Select.Trigger>,
  'children'
> {
  placeholder?: React.ReactNode;
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, placeholder, ...props }, ref) => (
    <Select.Trigger
      ref={ref}
      className={cn(
        'flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-input bg-background px-3.5 text-sm text-foreground transition-colors hover:border-muted-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25 data-[popup-open]:ring-2 data-[popup-open]:ring-ring/25 [&>span]:line-clamp-1 [&_svg]:size-4 [&_svg]:shrink-0',
        className,
      )}
      {...props}
    >
      <Select.Value placeholder={placeholder} />
      <Select.Icon className="pointer-events-none text-muted-foreground">
        <ChevronDown />
      </Select.Icon>
    </Select.Trigger>
  ),
);
SelectTrigger.displayName = 'SelectTrigger';

export const SelectContent = React.forwardRef<
  React.ComponentRef<typeof Select.Popup>,
  React.ComponentProps<typeof Select.Popup>
>(({ className, children, ...props }, ref) => (
  <Select.Portal>
    <Select.Positioner className="z-50" sideOffset={4}>
      <Select.Popup
        ref={ref}
        className={cn(
          'min-w-[var(--anchor-width)] max-h-[min(24rem,var(--available-height))] overflow-auto rounded-lg border border-border bg-popover p-1.5 text-popover-foreground shadow-lg transition-[opacity,transform] duration-150 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 origin-[var(--transform-origin)]',
          className,
        )}
        {...props}
      >
        {children}
      </Select.Popup>
    </Select.Positioner>
  </Select.Portal>
));
SelectContent.displayName = 'SelectContent';

export interface SelectItemProps extends React.ComponentProps<typeof Select.Item> {
  className?: string;
}

export const SelectItem = React.forwardRef<React.ComponentRef<typeof Select.Item>, SelectItemProps>(
  ({ className, children, ...props }, ref) => (
    <Select.Item
      ref={ref}
      className={cn(
        'flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-foreground outline-none data-[highlighted]:bg-accent data-[selected]:font-medium data-[selected]:text-primary',
        className,
      )}
      {...props}
    >
      <Select.ItemIndicator className="flex size-4 shrink-0 items-center justify-center">
        <Check className="size-4" />
      </Select.ItemIndicator>
      <Select.ItemText className="flex-1">{children}</Select.ItemText>
    </Select.Item>
  ),
);
SelectItem.displayName = 'SelectItem';

export const SelectGroup = Select.Group;
export const SelectLabel = Select.Label;
export const SelectSeparator = Select.Separator;

export { Select };
