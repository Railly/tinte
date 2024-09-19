"use client";
import { useMemo, useState } from "react";
import { Theme } from "@/lib/atoms";
import { Charts01 } from "./blocks/charts-01";
import { Dashboard05 } from "./blocks/dashboard-05";
import { Dashboard06 } from "./blocks/dashboard-06";
import { Dashboard07 } from "./blocks/dashboard-07";
import { Button } from "@/components/ui/button";
import { IconComputer, IconCode, IconCopy } from "@/components/ui/icons";
import { createCopyCodeFunction } from "@/lib/copy-code/generators";
import { useHighlighter } from "@/lib/hooks/use-highlighter";
import { defaultThemeConfig } from "@/lib/core/config";
import { generateVSCodeTheme } from "@/lib/core";
import { cn } from "@/lib/utils";
import { COMPONENTS_CODE } from "../constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const description = "A collection of health charts.";

interface BlockWrapperProps {
  children: React.ReactNode;
  title: string;
  theme: Theme;
  componentCode: string;
  onThemeChange: React.Dispatch<React.SetStateAction<Theme>>;
}

const BlockWrapper = ({
  children,
  title,
  theme,
  componentCode,
}: BlockWrapperProps) => {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const copyCode = createCopyCodeFunction(theme);

  const vsCodeTheme = useMemo(
    () => generateVSCodeTheme(defaultThemeConfig),
    [],
  );

  const { highlightedText } = useHighlighter({
    theme: vsCodeTheme,
    text: componentCode,
    language: "tsx",
  });

  return (
    <div className="w-full border rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-muted">
        <h3 className="text-sm font-semibold">{title}</h3>
        <TooltipProvider delayDuration={100}>
          <div className="flex space-x-2">
            <Button
              variant={activeTab === "preview" ? "default" : "outline"}
              onClick={() => setActiveTab("preview")}
              size="sm"
            >
              <IconComputer className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button
              variant={activeTab === "code" ? "default" : "outline"}
              onClick={() => setActiveTab("code")}
              size="sm"
            >
              <IconCode className="mr-2 h-4 w-4" />
              Code
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => copyCode("json")}
                  size="sm"
                >
                  <IconCopy className="h-4 w-4" />
                  <span className="sr-only">Copy Theme</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy Theme</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
      <div>
        {activeTab === "preview" ? (
          <div className="p-4">{children}</div>
        ) : (
          <div className="flex flex-col h-full w-full">
            <div className="h-[80vh] overflow-auto">
              <pre
                className={cn(
                  "w-full min-h-full text-sm [&>pre]:p-4 !text-[13px]",
                  !highlightedText && "bg-muted animate-pulse",
                )}
                dangerouslySetInnerHTML={{ __html: highlightedText }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export function ThemePreview({
  currentTheme,
  currentChartTheme,
  onThemeChange,
}: {
  currentTheme: Theme;
  currentChartTheme: Theme["charts"]["light"];
  onThemeChange: React.Dispatch<React.SetStateAction<Theme>>;
}) {
  const chartColors = useMemo(() => {
    return {
      chart1: `hsl(${currentChartTheme.chart1.h}, ${currentChartTheme.chart1.s}%, ${currentChartTheme.chart1.l}%)`,
      chart2: `hsl(${currentChartTheme.chart2.h}, ${currentChartTheme.chart2.s}%, ${currentChartTheme.chart2.l}%)`,
      chart3: `hsl(${currentChartTheme.chart3.h}, ${currentChartTheme.chart3.s}%, ${currentChartTheme.chart3.l}%)`,
      chart4: `hsl(${currentChartTheme.chart4.h}, ${currentChartTheme.chart4.s}%, ${currentChartTheme.chart4.l}%)`,
      chart5: `hsl(${currentChartTheme.chart5.h}, ${currentChartTheme.chart5.s}%, ${currentChartTheme.chart5.l}%)`,
    };
  }, [currentChartTheme]);

  return (
    <div className="flex flex-col gap-10 container relative items-center w-full p-6">
      <BlockWrapper
        title="Charts 01"
        theme={currentTheme}
        componentCode={COMPONENTS_CODE.Chart01}
        onThemeChange={onThemeChange}
      >
        <Charts01 chartColors={chartColors} />
      </BlockWrapper>
      <BlockWrapper
        title="Dashboard 05"
        theme={currentTheme}
        componentCode={COMPONENTS_CODE.Dashboard05}
        onThemeChange={onThemeChange}
      >
        <Dashboard05 />
      </BlockWrapper>
      <BlockWrapper
        title="Dashboard 06"
        theme={currentTheme}
        componentCode={COMPONENTS_CODE.Dashboard06}
        onThemeChange={onThemeChange}
      >
        <Dashboard06 />
      </BlockWrapper>
      <BlockWrapper
        title="Dashboard 07"
        theme={currentTheme}
        componentCode={COMPONENTS_CODE.Dashboard07}
        onThemeChange={onThemeChange}
      >
        <Dashboard07 />
      </BlockWrapper>
    </div>
  );
}