"use client";
import React, { useState } from "react";
import ReadOnlyPreview from "@/components/read-only-preview";
import { CODE_SAMPLES_SMALL } from "@/lib/constants";

interface ThemePreviewProps {
  vscodeTheme: any;
}

export function ThemePreview({ vscodeTheme }: ThemePreviewProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("typescript");
  console.log({ vscodeTheme });

  return (
    <div className="w-96 h-full flex border rounded-md shadow-md dark:shadow-foreground/5">
      <ReadOnlyPreview
        theme={vscodeTheme}
        code={CODE_SAMPLES_SMALL[selectedLanguage]}
        language={selectedLanguage}
        setLanguage={setSelectedLanguage}
      />
    </div>
  );
}
