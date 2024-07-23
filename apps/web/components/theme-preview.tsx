"use client";
import React, { useState } from "react";
import ReadOnlyPreview from "@/components/read-only-preview";
import { CODE_SAMPLES, CODE_SAMPLES_SMALL } from "@/lib/constants";
import { GeneratedVSCodeTheme } from "@/lib/core";
import { cn } from "@/lib/utils";

interface ThemePreviewProps {
  vsCodeTheme: GeneratedVSCodeTheme;
  width?: string;
  height?: string;
  small?: boolean;
}

export function ThemePreview({
  vsCodeTheme,
  width = "w-80 md:w-96",
  height = "h-[13.8rem]",
  small = true,
}: ThemePreviewProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("typescript");
  const _CODE_SAMPLES = small ? CODE_SAMPLES_SMALL : CODE_SAMPLES;

  return (
    <div
      className={cn(
        "flex border rounded-md shadow-md dark:shadow-foreground/5",
        width,
        height
      )}
    >
      <ReadOnlyPreview
        theme={vsCodeTheme}
        code={_CODE_SAMPLES[selectedLanguage]}
        language={selectedLanguage}
        setLanguage={setSelectedLanguage}
        height={height}
      />
    </div>
  );
}
