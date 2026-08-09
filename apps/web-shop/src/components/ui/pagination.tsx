import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function getPageItems(page: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const items: (number | 'ellipsis')[] = [];
  if (page <= 4) {
    items.push(1, 2, 3, 4, 5, 'ellipsis', totalPages);
  } else if (page >= totalPages - 3) {
    items.push(
      1,
      'ellipsis',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    );
  } else {
    items.push(1, 'ellipsis', page - 1, page, page + 1, 'ellipsis', totalPages);
  }
  return items;
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;
  const items = getPageItems(page, totalPages);

  return (
    <nav
      className={cn('flex items-center justify-center gap-1.5', className)}
      aria-label="Pagination"
    >
      <Button
        size="icon-sm"
        variant="ghost"
        disabled={page <= 1}
        onClick={() => onPageChange(1)}
        aria-label="First page"
      >
        <ChevronsLeft />
      </Button>
      <Button
        size="icon-sm"
        variant="ghost"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft />
      </Button>

      {items.map((item, i) =>
        item === 'ellipsis' ? (
          <span key={`e-${i}`} className="px-1 text-sm text-muted-foreground">
            …
          </span>
        ) : (
          <Button
            key={item}
            size="icon-sm"
            variant={item === page ? 'default' : 'ghost'}
            onClick={() => onPageChange(item)}
            aria-current={item === page ? 'page' : undefined}
            className="min-w-9 font-medium"
          >
            {item}
          </Button>
        ),
      )}

      <Button
        size="icon-sm"
        variant="ghost"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight />
      </Button>
      <Button
        size="icon-sm"
        variant="ghost"
        disabled={page >= totalPages}
        onClick={() => onPageChange(totalPages)}
        aria-label="Last page"
      >
        <ChevronsRight />
      </Button>
    </nav>
  );
}
