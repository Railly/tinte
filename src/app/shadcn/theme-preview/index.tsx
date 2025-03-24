import { Charts01 } from "./blocks/charts-01";
import { Dashboard05 } from "./blocks/dashboard-05";
import { Dashboard06 } from "./blocks/dashboard-06";
import { Dashboard07 } from "./blocks/dashboard-07";

import { BlockWrapper } from "./block-wrapper";
import { COMPONENTS_CODE } from "./constants";

export const description = "A collection of health charts.";

export function ThemePreview() {
  return (
    <div className="container relative mx-auto flex flex-col items-center gap-10 p-6">
      <BlockWrapper title="Charts 01" componentCode={COMPONENTS_CODE.Chart01}>
        <Charts01 />
      </BlockWrapper>
      <BlockWrapper
        title="Dashboard 05"
        componentCode={COMPONENTS_CODE.Dashboard05}
      >
        <Dashboard05 />
      </BlockWrapper>
      <BlockWrapper
        title="Dashboard 06"
        componentCode={COMPONENTS_CODE.Dashboard06}
      >
        <Dashboard06 />
      </BlockWrapper>
      <BlockWrapper
        title="Dashboard 07"
        componentCode={COMPONENTS_CODE.Dashboard07}
      >
        <Dashboard07 />
      </BlockWrapper>
    </div>
  );
}
