import { ChartAreaDemo } from "./chart-area-demo";
import { ChartBarDemo } from "./chart-bar-demo";
import { ChartBarMixed } from "./chart-bar-mixed";
import { ChartLineDemo } from "./chart-line-demo";

export function ChartDemo() {
  return (
    <div className="grid w-full max-w-screen-2xl gap-4 *:data-[slot=card]:flex-1 @2xl:grid-cols-2 @6xl:grid-cols-3">
      <ChartAreaDemo />
      <ChartBarDemo />
      <ChartBarMixed />
      <div className="@6xl:hidden">
        <ChartLineDemo />
      </div>
    </div>
  )
}
