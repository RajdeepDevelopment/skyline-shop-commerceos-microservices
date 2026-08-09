import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

/**
 * Minimal Radix-style Slot: merges props onto a single child element.
 */
export const Slot = React.forwardRef<HTMLElement, SlotProps>((props, ref) => {
  const { children, ...slotProps } = props;
  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ...slotProps,
      ...(children.props as object),
      ref,
      className: cn(
        (children.props as React.HTMLAttributes<HTMLElement>).className,
        slotProps.className,
      ),
    });
  }
  return <span ref={ref} {...slotProps} />;
});
Slot.displayName = 'Slot';
