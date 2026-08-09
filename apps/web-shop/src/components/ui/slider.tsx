import * as React from 'react';
import { Slider } from '@base-ui/react/slider';
import { cn } from '@/lib/utils';

type SliderValue = number | readonly number[];
type RangeValue = readonly [number, number];

function toRange(value: SliderValue): RangeValue {
  if (typeof value === 'number') return [value, value];
  return [value[0] ?? 0, value[1] ?? value[0] ?? 0];
}

export interface RangeSliderProps extends Omit<
  React.ComponentProps<typeof Slider.Root>,
  'value' | 'onValueChange'
> {
  value: RangeValue;
  onValueChange: (value: RangeValue) => void;
  min?: number;
  max?: number;
  step?: number;
}

function RangeSliderPrimitive({ value, onValueChange, className, ...props }: RangeSliderProps) {
  return (
    <Slider.Root
      value={[...value]}
      onValueChange={(next) => onValueChange(toRange(next))}
      className={cn('relative flex h-5 w-full touch-none items-center', className)}
      {...props}
    >
      <Slider.Track className="relative h-1.5 w-full rounded-full bg-accent">
        <Slider.Indicator className="h-full rounded-full bg-primary" />
      </Slider.Track>
      <Slider.Thumb
        index={0}
        className="flex size-4 items-center justify-center rounded-full border-2 border-primary bg-background shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
      />
      <Slider.Thumb
        index={1}
        className="flex size-4 items-center justify-center rounded-full border-2 border-primary bg-background shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
      />
    </Slider.Root>
  );
}

const RangeSlider = RangeSliderPrimitive;
export { RangeSlider, Slider };

export interface SliderRangeProps extends Omit<
  React.ComponentProps<typeof Slider.Root>,
  'value' | 'onValueChange'
> {
  value: RangeValue;
  onValueChange: (value: RangeValue) => void;
  min?: number;
  max?: number;
  step?: number;
  formatValue?: (value: number) => string;
}

function SliderRangePrimitive({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  formatValue,
  className,
  ...props
}: SliderRangeProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <RangeSlider
        value={value}
        onValueChange={onValueChange}
        min={min}
        max={max}
        step={step}
        {...props}
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-background-elevated/60 px-3 py-2 text-sm">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Min</div>
          <div className="font-semibold text-foreground">
            {formatValue ? formatValue(value[0]) : `₹${value[0].toLocaleString('en-IN')}`}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-background-elevated/60 px-3 py-2 text-sm">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Max</div>
          <div className="font-semibold text-foreground">
            {formatValue
              ? formatValue(value[1])
              : value[1] >= max
                ? `${max.toLocaleString('en-IN')}+`
                : `₹${value[1].toLocaleString('en-IN')}`}
          </div>
        </div>
      </div>
    </div>
  );
}

const SliderRange = SliderRangePrimitive;
export { SliderRange };
