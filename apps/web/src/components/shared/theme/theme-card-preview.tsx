"use client";

import { Area, AreaChart } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const miniData = [
  { value: 12, subscription: 20 },
  { value: 19, subscription: 45 },
  { value: 8, subscription: 35 },
  { value: 24, subscription: 55 },
  { value: 18, subscription: 40 },
];

const chartConfig = {
  value: {
    label: "Value",
    color: "var(--primary)",
  },
  subscription: {
    label: "Subscriptions",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ThemeCardPreview() {
  return (
    <div className="w-full h-full p-2 space-y-2 overflow-hidden">
      {/* Mini stats cards */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-card border rounded-lg p-2 shadow-sm">
          <div className="space-y-1.5">
            <p className="text-muted-foreground text-[10px]">
              Subscribe to newsletter
            </p>
            <Input
              className="h-5 pb-2 text-[8px] px-1.5 placeholder:!text-[7px] flex"
              placeholder="Enter email"
            />
            <Button size="sm" className="w-full h-4 text-[8px] py-0">
              Subscribe
            </Button>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-2 shadow-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground text-[10px]">Subscriptions</p>
            <p className="font-semibold text-xs">+2,350</p>
            <div className="text-[9px] text-muted-foreground">View More</div>
          </div>
          <div className="mt-1 h-6">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <AreaChart
                data={miniData}
                margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
              >
                <Area
                  dataKey="subscription"
                  fill="var(--color-subscription)"
                  fillOpacity={0.1}
                  stroke="var(--color-subscription)"
                  strokeWidth={1}
                  type="monotone"
                  dot={false}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>
      </div>

      {/* UI Components Showcase */}
      <div className="bg-card border rounded-lg p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-1">
              <Checkbox id="demo-check" className="h-2.5 w-2.5" />
              <label
                htmlFor="demo-check"
                className="text-[8px] text-muted-foreground"
              >
                Remember me
              </label>
            </div>
            <RadioGroup
              defaultValue="option1"
              className="flex items-center space-x-1"
            >
              <RadioGroupItem
                value="option1"
                id="demo-radio"
                className="h-2.5 w-2.5"
              />
              <label
                htmlFor="demo-radio"
                className="text-[8px] text-muted-foreground"
              >
                Option 1
              </label>
            </RadioGroup>
          </div>

          <div className="space-y-1">
            <div className="flex gap-0.5">
              <Badge variant="default" className="text-[6px] px-1 py-0 h-3">
                New
              </Badge>
              <Badge variant="outline" className="text-[6px] px-1 py-0 h-3">
                Beta
              </Badge>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="w-full h-4 text-[7px] py-0"
            >
              Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
