"use client";

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Button, Group, Input, NumberField } from "react-aria-components";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface NumberSliderProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  className?: string;
}

export function NumberSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = "",
  className,
}: NumberSliderProps) {
  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  const handleNumberChange = (newValue: number) => {
    const clampedValue = Math.min(Math.max(newValue, min), max);
    onChange(clampedValue);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="text-xs font-medium">
          {label}
        </Label>
      )}

      <div className="space-y-3">
        {/* Slider */}
        <Slider
          value={[value]}
          onValueChange={handleSliderChange}
          min={min}
          max={max}
          step={step}
          className="[&>:last-child>span]:rounded [&>:last-child>span]:bg-primary"
        />

        {/* Number Input */}
        <NumberField
          value={value}
          onChange={handleNumberChange}
          minValue={min}
          maxValue={max}
          step={step}
          formatOptions={{
            minimumFractionDigits: step < 1 ? 2 : 0,
          }}
        >
          <Group className="border-input outline-none data-focus-within:border-ring data-focus-within:ring-ring/50 relative inline-flex h-7 w-full items-center rounded-md border text-xs shadow-xs transition-[color,box-shadow] data-disabled:opacity-50 data-focus-within:ring-[3px]">
            <Input className="bg-background text-foreground min-w-0 flex-1 px-2 py-1 tabular-nums text-xs font-mono outline-none focus:outline-none focus:ring-0 rounded-l-md" />
            {unit && (
              <span className="text-muted-foreground text-xs font-mono px-1 border-l border-border flex-shrink-0 w-8 text-center">
                {unit}
              </span>
            )}
            <div className="flex flex-col h-full border-l border-border flex-shrink-0 rounded-r-md overflow-hidden">
              <Button
                slot="increment"
                className="bg-background text-muted-foreground hover:bg-accent hover:text-foreground flex h-3.5 w-5 items-center justify-center text-xs transition-colors border-b border-border"
              >
                <ChevronUpIcon size={8} />
              </Button>
              <Button
                slot="decrement"
                className="bg-background text-muted-foreground hover:bg-accent hover:text-foreground flex h-3.5 w-5 items-center justify-center text-xs transition-colors"
              >
                <ChevronDownIcon size={8} />
              </Button>
            </div>
          </Group>
        </NumberField>
      </div>
    </div>
  );
}