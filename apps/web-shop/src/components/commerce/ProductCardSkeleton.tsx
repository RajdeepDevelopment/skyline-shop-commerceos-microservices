import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function ProductCardSkeleton({
  className,
  layout = 'grid',
}: {
  className?: string;
  layout?: 'grid' | 'list';
}) {
  if (layout === 'list') {
    return (
      <div className={cn('flex gap-4 rounded-lg border border-border bg-card p-4', className)}>
        <Skeleton className="h-36 w-36 shrink-0 rounded-lg" />
        <div className="flex flex-1 flex-col gap-2 py-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-28" />
          <Skeleton className="mt-2 h-6 w-32" />
          <Skeleton className="mt-auto h-9 w-full rounded-md" />
        </div>
      </div>
    );
  }
  return (
    <div
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card',
        className,
      )}
    >
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-2 p-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-2 h-5 w-24" />
        <Skeleton className="mt-auto h-9 w-full rounded-md" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({
  count = 8,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5',
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
