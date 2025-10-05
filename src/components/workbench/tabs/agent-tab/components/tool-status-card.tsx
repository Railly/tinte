"use client";

import { Eye, Loader2, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolStatusCardProps {
  toolName: "generateTheme" | "getCurrentTheme";
  state: "input-streaming" | "input-available";
  message?: string;
  timer?: number;
}

const TOOL_CONFIG = {
  generateTheme: {
    icon: Palette,
    label: "Generating Theme",
    description: "Creating your custom theme...",
    color: "text-primary",
  },
  getCurrentTheme: {
    icon: Eye,
    label: "Analyzing Theme",
    description: "Reading current theme state...",
    color: "text-blue-600 dark:text-blue-400",
  },
};

export function ToolStatusCard({
  toolName,
  state,
  message,
  timer,
}: ToolStatusCardProps) {
  const config = TOOL_CONFIG[toolName];
  const Icon = config.icon;

  return (
    <div className="pl-2 w-full max-w-md">
      <div className="flex items-center gap-3 py-3 px-4 rounded-lg border border-border/50 bg-card/50">
        <div className={cn("shrink-0", config.color)}>
          <Icon className="h-4 w-4 animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{config.label}</span>
            <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {message || config.description}
          </p>
        </div>
        {timer !== undefined && (
          <span className="text-xs text-muted-foreground/60 tabular-nums">
            {timer}s
          </span>
        )}
      </div>
    </div>
  );
}
