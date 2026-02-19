"use client";

import type { TinteBlock } from "@tinte/core";
import { useQueryState } from "nuqs";
import { useCallback, useRef, useState } from "react";
import { DEFAULT_THEME } from "@/data/bundled-themes";
import { useCodeHighlight } from "@/hooks/use-code-highlight";
import { useExport } from "@/hooks/use-export";
import { DEFAULT_CODE } from "@/lib/code-samples";
import type { GradientId } from "@/lib/gradients";
import { GRADIENTS } from "@/lib/gradients";
import { mapTinteBlockToShiki } from "@/lib/shiki";
import { rayParsers } from "@/lib/url-state";
import { BackgroundPicker } from "./controls/background-picker";
import { SettingsBar } from "./controls/settings-bar";
import { ThemePicker } from "./controls/theme-picker";
import { ExportActions } from "./export-actions";
import { PreviewFrame } from "./preview-frame";

export function RayEditor() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [themeData, setThemeData] = useState<{
    light: TinteBlock;
    dark: TinteBlock;
  } | null>(null);

  const [themeSlug, setThemeSlug] = useQueryState("theme", rayParsers.theme);
  const [mode, setMode] = useQueryState("mode", rayParsers.mode);
  const [lang, setLang] = useQueryState("lang", rayParsers.lang);
  const [padding, setPadding] = useQueryState("padding", rayParsers.padding);
  const [fontSize, setFontSize] = useQueryState(
    "fontSize",
    rayParsers.fontSize,
  );
  const [lineNumbers, setLineNumbers] = useQueryState(
    "lineNumbers",
    rayParsers.lineNumbers,
  );
  const [bg, setBg] = useQueryState("bg", rayParsers.bg);
  const [title, setTitle] = useQueryState("title", rayParsers.title);

  const frameRef = useRef<HTMLDivElement>(null);

  const activeTheme = themeData ?? DEFAULT_THEME;
  const block: TinteBlock =
    mode === "dark" ? activeTheme.dark : activeTheme.light;

  const shikiTheme = mapTinteBlockToShiki(block, mode);

  const { html, cssVariables, loading } = useCodeHighlight({
    code,
    language: lang,
    theme: shikiTheme,
  });

  const { exportPng, exportSvg, copyToClipboard, canCopy, exporting } =
    useExport(frameRef);

  const gradient = GRADIENTS.find((g) => g.id === bg) ?? GRADIENTS[0];

  const handleThemeData = useCallback(
    (data: { light: TinteBlock; dark: TinteBlock }) => {
      setThemeData(data);
    },
    [],
  );

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex-1 min-h-0 flex items-center justify-center overflow-auto"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #131316 0%, #09090b 100%)",
        }}
      >
        <PreviewFrame
          ref={frameRef}
          padding={padding}
          gradientCss={gradient.css}
          themeBg={block.bg}
          themeBg2={block.bg_2}
          title={title}
          fontSize={fontSize}
          cssVariables={cssVariables}
          highlightedHtml={html}
          loading={loading}
          code={code}
          onCodeChange={setCode}
          lineNumbers={lineNumbers === "on"}
        />
      </div>

      <div className="shrink-0 flex items-center justify-between px-4 h-12 border-t border-[var(--border)] bg-[var(--background)]">
        <div className="flex items-center gap-3">
          <ThemePicker
            value={themeSlug}
            onChange={setThemeSlug}
            onThemeData={handleThemeData}
            mode={mode}
          />
          <div className="w-px h-4 bg-[var(--border)]" />
          <BackgroundPicker value={bg as GradientId} onChange={setBg} />
          <div className="w-px h-4 bg-[var(--border)]" />
          <SettingsBar
            padding={padding}
            onPaddingChange={setPadding}
            fontSize={fontSize}
            onFontSizeChange={setFontSize}
            lineNumbers={lineNumbers}
            onLineNumbersChange={setLineNumbers}
            mode={mode}
            onModeChange={setMode}
            title={title}
            onTitleChange={setTitle}
            language={lang}
            onLanguageChange={setLang}
          />
        </div>
        <ExportActions
          onCopy={copyToClipboard}
          onExportPng={exportPng}
          onExportSvg={exportSvg}
          canCopy={canCopy}
          exporting={exporting}
        />
      </div>
    </div>
  );
}
