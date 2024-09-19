"use client";

import React from "react";
import { DynamicAccentTitle } from "@/components/dynamic-accent-title";
import { IconPalette } from "@/components/ui/icons";
import { createCopyCodeFunction } from "@/lib/copy-code/generators";
import { GeneralHeader } from "@/components/general-header";
import { useThemeApplier } from "@/lib/hooks/use-theme-applier";
import { ResponsiveThemeEditor } from "./responsive-theme-editor";
import { ThemeGenerator } from "./theme-generator";
import { ThemePreview } from "./theme-preview";
import { ShadcnThemes } from "@prisma/client";

interface ThemeWorkspaceProps {
  allThemes: ShadcnThemes[];
}

export function ThemeWorkspace({ allThemes }: ThemeWorkspaceProps) {
  const {
    currentTheme,
    currentColorScheme,
    currentChartTheme,
    setCurrentTheme,
  } = useThemeApplier();

  const copyCode = createCopyCodeFunction(currentTheme);

  const headerActions = [
    {
      label: "Edit Palette",
      icon: IconPalette,
      component: (
        <ResponsiveThemeEditor
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
          copyCode={copyCode}
        />
      ),
    },
  ];

  return (
    <>
      <GeneralHeader actions={headerActions} />
      <main className="flex-grow flex flex-col">
        <DynamicAccentTitle
          theme={currentColorScheme}
          isTextareaFocused={false}
          words={["Create", "Customize", "Apply"]}
          accentColors={["primary", "secondary", "accent"]}
          intervalDuration={2000}
          subtitle="your shadcn/ui theme"
        />
        <ThemeGenerator allThemes={allThemes} />
        <div className="w-full flex flex-col">
          <div className="flex-grow w-full flex justify-center">
            <ThemePreview
              currentTheme={currentTheme}
              currentChartTheme={currentChartTheme}
              onThemeChange={setCurrentTheme}
            />
          </div>
        </div>
      </main>
    </>
  );
}
