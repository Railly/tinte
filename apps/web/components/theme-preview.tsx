"use client";
import React, { useState } from "react";
import ReadOnlyPreview from "@/components/read-only-preview";
import { CODE_SAMPLES, CODE_SAMPLES_SMALL } from "@/lib/constants";
import { GeneratedVSCodeTheme } from "@/lib/core";
import { cn } from "@/lib/utils";
import { ThemeConfig } from "@/lib/core/types";

interface ThemePreviewProps {
  vsCodeTheme: GeneratedVSCodeTheme;
  themeConfig: ThemeConfig;
  width?: string;
  height?: string;
  small?: boolean;
  withEditButton?: boolean;
}

export function ThemePreview({
  vsCodeTheme,
  themeConfig,
  width = "w-full md:w-96",
  height = "h-[13.8rem]",
  small = true,
  withEditButton = false,
}: ThemePreviewProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("typescript");
  const _CODE_SAMPLES = small ? CODE_SAMPLES_SMALL : CODE_SAMPLES;

  return (
    <div
      className={cn(
        "flex border rounded-md shadow-md dark:shadow-foreground/5",
        width,
        height,
      )}
    >
      <ReadOnlyPreview
        themeConfig={themeConfig}
        theme={vsCodeTheme}
        code={_CODE_SAMPLES[selectedLanguage]}
        language={selectedLanguage}
        setLanguage={setSelectedLanguage}
        height={height}
        withEditButton={withEditButton}
      />
    </div>
  );
}
