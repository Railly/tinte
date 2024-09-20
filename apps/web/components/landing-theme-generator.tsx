"use client";
import React, { forwardRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ShineButton } from "@/components/ui/shine-button";
import { IconGenerate, IconLoading, IconSparkles } from "@/components/ui/icons";
import { ThemeConfig } from "@/lib/core/types";
import { useThemeGenerator } from "@/lib/hooks/use-theme-generator";
import { useDescriptionEnhancer } from "@/lib/hooks/use-theme-enhancer";
import { useSearchParams } from "next/navigation";

interface LandingThemeGeneratorProps {
  updateThemeConfig: (newConfig: Partial<ThemeConfig>) => void;
  setIsTextareaFocused: (isFocused: boolean) => void;
}

const MAX_CHARS = 200;

export const LandingThemeGenerator = forwardRef<
  HTMLDivElement,
  LandingThemeGeneratorProps
>(({ updateThemeConfig, setIsTextareaFocused }, ref) => {
  const searchParams = useSearchParams();
  const [themeDescription, setThemeDescription] = useState<string>(
    searchParams?.get("description") || "",
  );
  const { isGenerating, generateTheme } = useThemeGenerator(updateThemeConfig);
  const { isEnhancing, enhanceDescription } = useDescriptionEnhancer();

  const handleGenerateTheme = async () => {
    const newTheme = await generateTheme(themeDescription);
    if (newTheme) {
      updateThemeConfig(newTheme);
    }
  };

  const handleEnhanceDescription = async () => {
    const enhancedDescription = await enhanceDescription(
      themeDescription,
      "vscode",
    );
    if (enhancedDescription) {
      setThemeDescription(enhancedDescription);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleGenerateTheme();
    }
  };

  return (
    <div
      ref={ref}
      className="flex flex-col w-full md:w-96 border rounded-md shadow-md dark:shadow-foreground/5"
    >
      <div className="flex justify-between items-center p-2 rounded-t-md bg-card text-card-foreground border-b">
        <h2 className="text-sm font-bold">Theme Generator</h2>
        <ShineButton
          variant="default"
          onClick={handleGenerateTheme}
          disabled={isGenerating || themeDescription.trim().length < 3}
        >
          {isGenerating ? (
            <IconLoading className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <IconGenerate className="w-4 h-4 mr-2" />
          )}
          <span>{isGenerating ? "Generating..." : "Generate"}</span>
        </ShineButton>
      </div>
      <div className="relative p-4">
        <Textarea
          placeholder="Describe your ideal theme (e.g., 'A dark theme with neon accents for a cyberpunk feel')"
          value={themeDescription}
          onChange={(e) => setThemeDescription(e.target.value)}
          onFocus={() => setIsTextareaFocused(true)}
          onKeyDown={handleKeyDown}
          className="resize-none w-full !h-[8.5rem] !pb-8"
          minLength={3}
          maxLength={MAX_CHARS}
        />
        <Button
          size="sm"
          onClick={handleEnhanceDescription}
          variant="outline"
          className="absolute bottom-6 left-6 text-muted-foreground hover:text-foreground transition-all duration-200"
          disabled={isEnhancing || themeDescription.trim().length < 3}
        >
          {isEnhancing ? (
            <>
              <IconLoading className="w-4 h-4 mr-1 animate-spin" />
              Enhancing...
            </>
          ) : (
            <>
              <IconSparkles className="w-4 h-4 mr-1" />
              Enhance
            </>
          )}
        </Button>

        <span className="absolute bottom-6 right-6 text-muted-foreground text-sm">
          {themeDescription.length}/{MAX_CHARS}
        </span>
      </div>
    </div>
  );
});
