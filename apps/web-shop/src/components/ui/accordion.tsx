import * as React from 'react';
import { Accordion } from '@base-ui/react/accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const AccordionRoot = Accordion.Root;
export const AccordionItem = Accordion.Item;

export const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof Accordion.Trigger>,
  React.ComponentProps<typeof Accordion.Trigger>
>(({ className, children, ...props }, ref) => (
  <Accordion.Header className="flex">
    <Accordion.Trigger
      ref={ref}
      className={cn(
        'group flex flex-1 items-center justify-between py-4 text-left text-sm font-semibold transition-colors outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50 [&[data-panel-open]]:text-primary',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[panel-open]:rotate-180" />
    </Accordion.Trigger>
  </Accordion.Header>
));
AccordionTrigger.displayName = 'AccordionTrigger';

export const AccordionPanel = React.forwardRef<
  React.ComponentRef<typeof Accordion.Panel>,
  React.ComponentProps<typeof Accordion.Panel>
>(({ className, children, ...props }, ref) => (
  <Accordion.Panel
    ref={ref}
    className={cn(
      'overflow-hidden text-sm text-muted-foreground transition-[height,opacity] duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[starting-style]:ease-out data-[ending-style]:ease-in',
      className,
    )}
    {...props}
  >
    <div className="pb-4 pt-0">{children}</div>
  </Accordion.Panel>
));
AccordionPanel.displayName = 'AccordionPanel';

export { Accordion };
