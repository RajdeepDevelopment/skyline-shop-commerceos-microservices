import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  adornment?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, adornment, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {adornment && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground [&_svg]:size-4">
            {adornment}
          </span>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'flex h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground transition-colors placeholder:text-muted-foreground/70 hover:border-muted-foreground/40 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-50',
            adornment && 'pl-10',
            error &&
              'border-destructive/70 focus-visible:border-destructive focus-visible:ring-destructive/25',
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
