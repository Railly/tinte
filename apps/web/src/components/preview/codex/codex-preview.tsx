"use client";

import type { CodexTheme, CodexThemeEntry } from "@tinte/core";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useThemeMode } from "@/stores/hooks";

interface CodexPreviewProps {
  theme: CodexTheme;
  className?: string;
}

export function CodexPreview({ theme, className }: CodexPreviewProps) {
  const { mode } = useThemeMode();
  const current: CodexThemeEntry = mode === "dark" ? theme.dark : theme.light;
  const { accent, ink, surface, semanticColors, contrast } = current.theme;

  const muted = mixColors(ink, surface, 0.5);
  const border = mixColors(ink, surface, 0.15);
  const surfaceElevated = mixColors(ink, surface, 0.05);

  const codeLines = [
    { type: "prompt", text: "$ codex" },
    { type: "blank", text: "" },
    {
      type: "assistant",
      text: "I'll help you build that. Let me check the codebase first.",
    },
    { type: "blank", text: "" },
    { type: "tool", label: "Read", text: "src/app/page.tsx" },
    { type: "tool", label: "Read", text: "src/lib/utils.ts" },
    { type: "tool", label: "Search", text: '"export function" in src/' },
    { type: "blank", text: "" },
    {
      type: "assistant",
      text: "Found the relevant files. Here's the diff:",
    },
    { type: "blank", text: "" },
    { type: "diff-header", text: "src/app/page.tsx" },
    { type: "diff-remove", text: '  const data = await fetch("/api/old");' },
    {
      type: "diff-add",
      text: '  const data = await fetch("/api/themes");',
    },
    { type: "diff-remove", text: "  return <OldComponent data={data} />;" },
    {
      type: "diff-add",
      text: "  return <ThemeGrid data={data} accent={accent} />;",
    },
    { type: "blank", text: "" },
    { type: "assistant", text: "Changes applied. Want me to run the tests?" },
  ];

  return (
    <div
      className={`rounded-lg overflow-hidden h-full flex flex-col ${className || ""}`}
      style={{ backgroundColor: surface, color: ink }}
    >
      <div
        className="flex items-center gap-2 px-4 py-2 text-xs border-b shrink-0"
        style={{ borderColor: border, backgroundColor: surfaceElevated }}
      >
        <div className="flex gap-1.5">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: `${ink}20` }}
          />
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: `${ink}20` }}
          />
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: `${ink}20` }}
          />
        </div>
        <span className="ml-2 font-mono" style={{ color: muted }}>
          Codex — ~/projects/tinte
        </span>
        <div className="ml-auto flex items-center gap-2">
          <span
            className="text-[10px] px-1.5 py-0.5 rounded font-mono"
            style={{ backgroundColor: `${accent}20`, color: accent }}
          >
            {current.codeThemeId}
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 font-mono text-xs leading-relaxed">
          {codeLines.map((line, i) => (
            <CodexLine
              key={i}
              line={line}
              accent={accent}
              ink={ink}
              muted={muted}
              surface={surface}
              semanticColors={semanticColors}
            />
          ))}
          <div className="flex items-center gap-1 mt-1">
            <span style={{ color: accent }}>{">"}</span>
            <span
              className="inline-block w-2 h-4 animate-pulse"
              style={{ backgroundColor: accent }}
            />
          </div>
        </div>
      </ScrollArea>

      <div
        className="flex items-center justify-between px-4 py-1.5 text-[10px] border-t shrink-0"
        style={{ borderColor: border, backgroundColor: surfaceElevated }}
      >
        <div className="flex items-center gap-3" style={{ color: muted }}>
          <span className="flex items-center gap-1">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: semanticColors.skill }}
            />
            o3
          </span>
          <span>~/projects/tinte</span>
        </div>
        <div className="flex items-center gap-2" style={{ color: muted }}>
          <span style={{ color: semanticColors.diffAdded }}>+14</span>
          <span style={{ color: semanticColors.diffRemoved }}>-8</span>
          <span className="flex items-center gap-1">
            <ContrastBar value={contrast} accent={accent} muted={muted} />
            {contrast}
          </span>
        </div>
      </div>
    </div>
  );
}

function CodexLine({
  line,
  accent,
  ink,
  muted,
  surface,
  semanticColors,
}: {
  line: { type: string; text: string; label?: string };
  accent: string;
  ink: string;
  muted: string;
  surface: string;
  semanticColors: { diffAdded: string; diffRemoved: string; skill: string };
}) {
  switch (line.type) {
    case "prompt":
      return (
        <div>
          <span style={{ color: accent }}>$</span>{" "}
          <span style={{ color: ink, fontWeight: 600 }}>codex</span>
        </div>
      );
    case "blank":
      return <div className="h-4" />;
    case "assistant":
      return <div style={{ color: ink }}>{line.text}</div>;
    case "tool":
      return (
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] px-1 py-0.5 rounded"
            style={{
              backgroundColor: `${semanticColors.skill}20`,
              color: semanticColors.skill,
            }}
          >
            {line.label}
          </span>
          <span style={{ color: muted }}>{line.text}</span>
        </div>
      );
    case "diff-header":
      return (
        <div className="mt-1" style={{ color: muted, fontWeight: 600 }}>
          --- {line.text}
        </div>
      );
    case "diff-remove":
      return (
        <div
          className="px-2 -mx-2 rounded-sm"
          style={{
            backgroundColor: `${semanticColors.diffRemoved}15`,
            color: semanticColors.diffRemoved,
          }}
        >
          - {line.text}
        </div>
      );
    case "diff-add":
      return (
        <div
          className="px-2 -mx-2 rounded-sm"
          style={{
            backgroundColor: `${semanticColors.diffAdded}15`,
            color: semanticColors.diffAdded,
          }}
        >
          + {line.text}
        </div>
      );
    default:
      return <div style={{ color: ink }}>{line.text}</div>;
  }
}

function ContrastBar({
  value,
  accent,
  muted,
}: {
  value: number;
  accent: string;
  muted: string;
}) {
  return (
    <div
      className="w-8 h-1.5 rounded-full overflow-hidden"
      style={{ backgroundColor: `${muted}40` }}
    >
      <div
        className="h-full rounded-full"
        style={{ width: `${value}%`, backgroundColor: accent }}
      />
    </div>
  );
}

function mixColors(color1: string, color2: string, ratio: number): string {
  const hex = (c: string) => {
    const h = c.replace("#", "");
    return [
      Number.parseInt(h.slice(0, 2), 16),
      Number.parseInt(h.slice(2, 4), 16),
      Number.parseInt(h.slice(4, 6), 16),
    ];
  };

  try {
    const [r1, g1, b1] = hex(color1);
    const [r2, g2, b2] = hex(color2);
    const r = Math.round(r1 * ratio + r2 * (1 - ratio));
    const g = Math.round(g1 * ratio + g2 * (1 - ratio));
    const b = Math.round(b1 * ratio + b2 * (1 - ratio));
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  } catch {
    return color1;
  }
}
