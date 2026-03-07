"use client";

import { Badge } from "@/components/ui/badge";

const CODE_LINES = [
  { number: 1, content: 'import { clsx } from "clsx";' },
  { number: 2, content: "" },
  {
    number: 3,
    content: "export function cn(...inputs) {",
    highlight: true,
  },
  { number: 4, content: "  return clsx(inputs);" },
  { number: 5, content: "}" },
];

export function SurfaceCodeSelectionPreview() {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border bg-surface p-4 text-surface-foreground">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Surface</span>
          <Badge variant="outline" className="text-[10px]">
            v4
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Elevated content area using surface tokens.
        </p>
      </div>

      <div className="rounded-xl border bg-code text-code-foreground font-mono text-sm overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <span className="text-xs">utils.ts</span>
          <Badge variant="outline" className="text-[10px]">
            code
          </Badge>
        </div>
        <div className="p-4">
          {CODE_LINES.map((line) => (
            <div
              key={line.number}
              className={line.highlight ? "bg-code-highlight -mx-4 px-4" : ""}
            >
              <span className="text-code-number inline-block w-6 text-right mr-4 select-none">
                {line.number}
              </span>
              <span>{line.content}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border p-4">
        <span className="text-sm font-medium mb-2 block">Selection</span>
        <p className="text-sm">
          Try selecting{" "}
          <span className="bg-selection text-selection-foreground px-1 rounded">
            this highlighted text
          </span>{" "}
          to preview selection tokens.
        </p>
      </div>
    </div>
  );
}
