import * as React from 'react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: number): TimeLeft {
  const diff = Math.max(0, target - Date.now());
  return {
    hours: Math.floor(diff / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  };
}

export function useCountdown(targetTimestamp: number) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(targetTimestamp));

  useEffect(() => {
    const id = window.setInterval(() => setTimeLeft(getTimeLeft(targetTimestamp)), 1000);
    return () => window.clearInterval(id);
  }, [targetTimestamp]);

  return timeLeft;
}

export function FlashCountdown({
  targetTimestamp,
  className,
  size = 'md',
}: {
  targetTimestamp: number;
  className?: string;
  size?: 'sm' | 'md';
}) {
  const { hours, minutes, seconds } = useCountdown(targetTimestamp);
  const cell = size === 'sm' ? 'min-w-9 px-2 py-1.5 text-sm' : 'min-w-12 px-2.5 py-2 text-base';
  const label = size === 'sm' ? 'text-[9px]' : 'text-[10px]';

  const cells = [
    { value: hours, unit: 'hrs' },
    { value: minutes, unit: 'min' },
    { value: seconds, unit: 'sec' },
  ];

  return (
    <div className={cn('flex items-center gap-1.5', className)} aria-label="Offer ends in">
      {cells.map((c, i) => (
        <React.Fragment key={c.unit}>
          <div className="flex flex-col items-center rounded-lg border border-border bg-background-elevated/70">
            <span className={cn('font-bold tabular-nums text-foreground', cell)}>
              {String(c.value).padStart(2, '0')}
            </span>
            <span className={cn('pb-1 uppercase tracking-wide text-muted-foreground', label)}>
              {c.unit}
            </span>
          </div>
          {i < cells.length - 1 && <span className="pb-3 font-bold text-muted-foreground">:</span>}
        </React.Fragment>
      ))}
    </div>
  );
}
