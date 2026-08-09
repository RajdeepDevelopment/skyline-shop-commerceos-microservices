import * as React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  icon,
  viewAllHref,
  viewAllLabel = 'View All',
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-5 flex items-end justify-between gap-4', className)}>
      <div className="flex items-center gap-3">
        {icon && (
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </span>
        )}
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">{title}</h2>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
          )}
        </div>
      </div>
      {viewAllHref && (
        <Link
          to={viewAllHref}
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary-400"
        >
          {viewAllLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
