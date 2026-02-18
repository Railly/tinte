"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DesignSystemOutput } from "@tinte/providers";
import { useThemeStore } from "@/stores/theme";
import { ComponentsTab } from "./components-tab";
import { DataDisplayTab } from "./data-display-tab";
import { FeedbackTab } from "./feedback-tab";
import { FormsTab } from "./forms-tab";
import { FoundationTab } from "./foundation-tab";

interface DesignSystemPreviewProps {
  theme: DesignSystemOutput;
  className?: string;
}

export function DesignSystemPreview({
  theme,
  className,
}: DesignSystemPreviewProps) {
  const tinteTheme = useThemeStore((state) => state.tinteTheme);
  const currentMode = useThemeStore((state) => state.mode);

  const currentColors = tinteTheme?.[currentMode] || {
    bg: "#ffffff",
    bg_2: "#f8f9fa",
    ui: "#e9ecef",
    ui_2: "#dee2e6",
    ui_3: "#ced4da",
    tx: "#212529",
    tx_2: "#6c757d",
    tx_3: "#adb5bd",
    pr: "#007bff",
    sc: "#6c757d",
    ac_1: "#dc3545",
    ac_2: "#28a745",
    ac_3: "#ffc107",
  };

  return (
    <div className={`h-full font-sans ${className}`}>
      <div className="">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Design System</h1>
          <p className="text-muted-foreground text-sm">
            {theme.brand.description}
          </p>
        </div>

        <Tabs defaultValue="foundation" className="w-full">
          <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
            <TabsTrigger
              value="foundation"
              className="data-[state=active]:bg-muted"
            >
              Foundation
            </TabsTrigger>
            <TabsTrigger
              value="components"
              className="data-[state=active]:bg-muted"
            >
              Components
            </TabsTrigger>
            <TabsTrigger value="forms" className="data-[state=active]:bg-muted">
              Forms
            </TabsTrigger>
            <TabsTrigger value="data" className="data-[state=active]:bg-muted">
              Data Display
            </TabsTrigger>
            <TabsTrigger
              value="feedback"
              className="data-[state=active]:bg-muted"
            >
              Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="foundation" className="mt-4">
            <FoundationTab theme={theme} currentColors={currentColors} />
          </TabsContent>

          <TabsContent value="components" className="mt-4">
            <ComponentsTab />
          </TabsContent>

          <TabsContent value="forms" className="mt-4">
            <FormsTab />
          </TabsContent>

          <TabsContent value="data" className="mt-4">
            <DataDisplayTab />
          </TabsContent>

          <TabsContent value="feedback" className="mt-4">
            <FeedbackTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
