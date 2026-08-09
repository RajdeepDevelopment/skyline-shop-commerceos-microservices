import * as React from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

type SheetSide = 'top' | 'bottom' | 'left' | 'right';

const sideStyles: Record<SheetSide, string> = {
  top: 'top-0 inset-x-0 rounded-b-lg',
  bottom: 'bottom-0 inset-x-0 rounded-t-lg',
  left: 'left-0 inset-y-0 rounded-r-lg',
  right: 'right-0 inset-y-0 rounded-l-lg',
};

const enterExitStyles: Record<SheetSide, string> = {
  top: 'data-[starting-style]:-translate-y-full data-[ending-style]:-translate-y-full',
  bottom: 'data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full',
  left: 'data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full',
  right: 'data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full',
};

export const SheetRoot = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

export interface SheetContentProps extends React.ComponentProps<typeof Dialog.Popup> {
  side?: SheetSide;
  showClose?: boolean;
}

export function SheetContent({
  className,
  children,
  side = 'right',
  showClose = true,
  ...props
}: SheetContentProps) {
  return (
    <Dialog.Portal>
      <Dialog.Backdrop className="fixed inset-0 z-50 bg-foreground/50 transition-opacity duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
      <Dialog.Popup
        className={cn(
          'fixed z-50 flex w-full flex-col bg-popover text-popover-foreground shadow-lg transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] max-sm:w-full',
          side === 'left' || side === 'right' ? 'h-full w-full max-w-md' : 'max-h-[85vh]',
          sideStyles[side],
          enterExitStyles[side],
          className,
        )}
        {...props}
      >
        {showClose && (
          <Dialog.Close className="absolute right-4 top-4 z-10 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        )}
        {children}
      </Dialog.Popup>
    </Dialog.Portal>
  );
}

export const SheetTitle = React.forwardRef<
  React.ComponentRef<typeof Dialog.Title>,
  React.ComponentProps<typeof Dialog.Title>
>(({ className, ...props }, ref) => (
  <Dialog.Title
    ref={ref}
    className={cn('text-base font-semibold tracking-tight', className)}
    {...props}
  />
));
SheetTitle.displayName = 'SheetTitle';

export { Dialog as Sheet };
