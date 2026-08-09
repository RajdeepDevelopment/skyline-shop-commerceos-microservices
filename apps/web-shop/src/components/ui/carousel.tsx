import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

type CarouselOptions = NonNullable<Parameters<typeof useEmblaCarousel>[0]>;
type EmblaCarouselType = NonNullable<ReturnType<typeof useEmblaCarousel>[1]>;

type CarouselApi = EmblaCarouselType;

interface CarouselProps {
  children: React.ReactNode;
  className?: string;
  opts?: CarouselOptions;
  autoplay?: boolean;
  autoplayDelay?: number;
  showArrows?: boolean;
  showDots?: boolean;
  arrowClassName?: string;
}

export function Carousel({
  children,
  className,
  opts,
  autoplay = false,
  autoplayDelay = 4000,
  showArrows = true,
  showDots = true,
  arrowClassName,
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    opts,
    autoplay ? [Autoplay({ delay: autoplayDelay, stopOnInteraction: true })] : [],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect(emblaApi);
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className={cn('group relative', className)}>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex touch-pan-y gap-3">{children}</div>
      </div>

      {showArrows && scrollSnaps.length > 1 && (
        <>
          <Button
            size="icon"
            variant="secondary"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            className={cn(
              'absolute left-2 top-1/2 z-10 -translate-y-1/2 opacity-0 shadow-xl transition-opacity group-hover:opacity-100 disabled:opacity-0',
              arrowClassName,
            )}
            aria-label="Previous slide"
          >
            <ChevronLeft />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            className={cn(
              'absolute right-2 top-1/2 z-10 -translate-y-1/2 opacity-0 shadow-xl transition-opacity group-hover:opacity-100 disabled:opacity-0',
              arrowClassName,
            )}
            aria-label="Next slide"
          >
            <ChevronRight />
          </Button>
        </>
      )}

      {showDots && scrollSnaps.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i === selectedIndex
                  ? 'w-6 bg-primary'
                  : 'w-1.5 bg-accent hover:bg-accent-foreground/40',
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CarouselSlide({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('min-w-0 shrink-0 grow-0 basis-full', className)} {...props}>
      {children}
    </div>
  );
}

export type { CarouselApi };
