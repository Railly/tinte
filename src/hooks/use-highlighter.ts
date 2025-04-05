"use client";

import { useQuery } from "@tanstack/react-query";
import { createHighlighter } from "shiki";
import { getVSCodeColors } from "@/core/get-vscode-colors";
import { getVSCodeTokenColors } from "@/core/get-vscode-tokens";
import type { VSCodePalette } from "@/db/schema";
import { normalizeName } from "@/lib/utils";

export function useHighlighter({
  id,
  name,
  dark,
  light,
}: {
  id: string;
  name: string;
  dark: VSCodePalette;
  light: VSCodePalette;
}) {
  return useQuery({
    queryKey: ["highlighter", id],
    queryFn: () =>
      createHighlighter({
        langs: ["typescript", "javascript", "json"],
        themes: [
          {
            name: `${normalizeName(name)}-dark`,
            colors: getVSCodeColors(dark, "dark"),
            tokenColors: getVSCodeTokenColors(dark),
          },
          {
            name: `${normalizeName(name)}-light`,
            colors: getVSCodeColors(light, "light"),
            tokenColors: getVSCodeTokenColors(light),
          },
        ],
      }),
    enabled: !!id,
  });
}
