"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { IconCopy, IconInfo } from "@/components/ui/icons";
import { toast } from "sonner";
import { useHighlighter } from "@/lib/hooks/use-highlighter";
import { defaultThemeConfig } from "@/lib/core/config";
import { generateVSCodeTheme } from "@/lib/core";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ThemeInstallCodeProps {
  themeId: string;
}

type PackageManager = "npm" | "bun" | "pnpm";

export function ThemeInstallCode({ themeId }: ThemeInstallCodeProps) {
  const [packageManager, setPackageManager] = useState<PackageManager>("npm");

  const getInstallCommand = (pm: PackageManager) => {
    const baseCommand = `shadcn add ${process.env.NEXT_PUBLIC_BASE_URL!}/s/${themeId}`;
    switch (pm) {
      case "npm":
        return `npx ${baseCommand}`;
      case "bun":
        return `bunx --bun ${baseCommand}`;
      case "pnpm":
        return `pnpm dlx ${baseCommand}`;
    }
  };

  const installCommand = getInstallCommand(packageManager);

  const vsCodeTheme = useMemo(
    () => generateVSCodeTheme(defaultThemeConfig),
    [],
  );

  const { highlightedText } = useHighlighter({
    theme: vsCodeTheme,
    text: installCommand,
    language: "bash",
  });

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
      toast.success("Copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy command");
    }
  };

  return (
    <div className="w-full px-6">
      <div className="w-full md:max-w-xl mx-auto">
        <div className="bg-card text-card-foreground rounded-t-lg overflow-hidden border border-border">
          <div className="flex items-center justify-between border-b px-4 py-2">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {(["npm", "pnpm", "bun"] as const).map((pm) => (
                  <Button
                    key={pm}
                    variant={packageManager === pm ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPackageManager(pm)}
                  >
                    {pm}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <IconInfo className="h-4 w-4" />
                      <span className="sr-only">Command Info</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Run this command to install the theme</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                <IconCopy className="h-4 w-4" />
                <span className="sr-only">Copy</span>
              </Button>
            </div>
          </div>
          <div className="bg-card relative">
            <pre
              className={cn(
                "w-full min-h-[52px] [&>pre]:p-4 [&>pre]:!bg-transparent dark:[&>pre]:!bg-transparent [&>pre>code>span]:!bg-transparent dark:[&>pre>code>span]:!bg-transparent [&>pre>code>span_span]:!bg-transparent dark:[&>pre>code>span_span]:!bg-transparent text-sm overflow-x-auto",
                !highlightedText && "bg-muted animate-pulse",
              )}
              dangerouslySetInnerHTML={{ __html: highlightedText }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
