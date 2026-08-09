import * as React from 'react';
import { Tabs } from '@base-ui/react/tabs';
import { cn } from '@/lib/utils';

export const TabsRoot = Tabs.Root;
export const TabsList = Tabs.List;
export const TabsIndicator = Tabs.Indicator;
export const TabsPanel = Tabs.Panel;

export const TabsTab = React.forwardRef<
  React.ComponentRef<typeof Tabs.Tab>,
  React.ComponentProps<typeof Tabs.Tab>
>(({ className, ...props }, ref) => (
  <Tabs.Tab
    ref={ref}
    className={cn(
      'relative z-10 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 data-[active]:text-foreground',
      className,
    )}
    {...props}
  />
));
TabsTab.displayName = 'TabsTab';

export { Tabs };
