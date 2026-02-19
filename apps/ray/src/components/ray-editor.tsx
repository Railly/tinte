"use client";

import type { TinteBlock } from "@tinte/core";
import { useQueryState } from "nuqs";
import { Check, Copy, Terminal } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { DEFAULT_THEME } from "@/data/bundled-themes";
import { useCodeHighlight } from "@/hooks/use-code-highlight";
import { useExport } from "@/hooks/use-export";
import { CODE_SAMPLES, DEFAULT_CODE } from "@/lib/code-samples";
import type { Language } from "@/lib/code-samples";
import { resolveBackground } from "@/lib/gradients";
import { mapTinteBlockToShiki } from "@/lib/shiki";
import { rayParsers } from "@/lib/url-state";
import { BackgroundPicker } from "./controls/background-picker";
import { ColorEditor } from "./controls/color-editor";
import { ImageThemeUpload } from "./controls/image-theme-upload";
import { SettingsBar } from "./controls/settings-bar";
import { ThemePicker } from "./controls/theme-picker";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ApiDialog } from "./api-dialog";
import { ExportActions } from "./export-actions";
import { PreviewFrame } from "./preview-frame";

export function RayEditor() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [themeData, setThemeData] = useState<{
    light: TinteBlock;
    dark: TinteBlock;
  } | null>(null);
  const [originalThemeData, setOriginalThemeData] = useState<{
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

  const gradientCss = resolveBackground(bg);

  const defaultSamples = useMemo(() => new Set(Object.values(CODE_SAMPLES)), []);

  const handleLanguageChange = useCallback(
    (newLang: string) => {
      setLang(newLang);
      if (defaultSamples.has(code)) {
        const sample = CODE_SAMPLES[newLang as Language];
        if (sample) setCode(sample);
      }
    },
    [code, defaultSamples, setLang],
  );

  const handleThemeData = useCallback(
    (data: { light: TinteBlock; dark: TinteBlock }) => {
      setThemeData(data);
      setOriginalThemeData(data);
    },
    [],
  );

  const originalBlock: TinteBlock | undefined = originalThemeData
    ? mode === "dark"
      ? originalThemeData.dark
      : originalThemeData.light
    : undefined;

  const handleColorEdit = useCallback(
    (editedBlock: TinteBlock) => {
      const base = themeData ?? DEFAULT_THEME;
      if (mode === "dark") {
        setThemeData({ light: base.light, dark: editedBlock });
      } else {
        setThemeData({ light: editedBlock, dark: base.dark });
      }
    },
    [themeData, mode],
  );

  const handleImageTheme = useCallback(
    (data: { dark: TinteBlock; light: TinteBlock; gradient: string; name: string }) => {
      const theme = { dark: data.dark, light: data.light };
      setThemeData(theme);
      setOriginalThemeData(theme);
      setThemeSlug(`custom:${data.name.toLowerCase().replace(/\s+/g, "-")}`);
      const bgColor = mode === "dark" ? data.dark.bg : data.light.bg;
      setBg(bgColor);
    },
    [setThemeSlug, setBg, mode],
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
          gradientCss={gradientCss}
          themeBg={block.bg}
          themeBg2={block.bg_2}
          title={title}
          onTitleChange={setTitle}
          fontSize={fontSize}
          cssVariables={cssVariables}
          highlightedHtml={html}
          loading={loading}
          code={code}
          onCodeChange={setCode}
          lineNumbers={lineNumbers === "on"}
        />
      </div>

      <div className="shrink-0 flex items-center justify-between px-4 h-12 border-t bg-background">
        <div className="flex items-center gap-3">
          <ThemePicker
            value={themeSlug}
            onChange={setThemeSlug}
            onThemeData={handleThemeData}
            mode={mode}
          />
          <ColorEditor
            block={block}
            onChange={handleColorEdit}
            originalBlock={originalBlock}
          />
          <ImageThemeUpload onThemeExtracted={handleImageTheme} />
          <div className="w-px h-4 bg-border" />
          <BackgroundPicker value={bg} onChange={setBg} />
          <div className="w-px h-4 bg-border" />
          <SettingsBar
            padding={padding}
            onPaddingChange={setPadding}
            fontSize={fontSize}
            onFontSizeChange={setFontSize}
            lineNumbers={lineNumbers}
            onLineNumbersChange={setLineNumbers}
            mode={mode}
            onModeChange={setMode}
            language={lang}
            onLanguageChange={handleLanguageChange}
          />
        </div>
        <div className="flex items-center gap-3">
          <ExportActions
            onCopy={copyToClipboard}
            onExportPng={exportPng}
            onExportSvg={exportSvg}
            canCopy={canCopy}
            exporting={exporting}
          />
          <SkillInstallButton />
        </div>
      </div>
    </div>
  );
}

function SkillInstallButton() {
  const [copied, setCopied] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText("npx skills add Railly/tinte");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <>
      <ButtonGroup>
        <Button
          variant="outline"
          size="xs"
          className="gap-1.5 font-mono text-[11px]"
          onClick={handleCopy}
          title="Copy install command"
        >
          {copied ? (
            <Check className="size-3 text-emerald-500" />
          ) : (
            <Copy className="size-3 text-muted-foreground" />
          )}
          npx skills add
        </Button>
        <Button
          variant="outline"
          size="icon-xs"
          onClick={() => setDocsOpen(true)}
          title="API & Skill docs"
        >
          <Terminal className="size-3" />
        </Button>
      </ButtonGroup>
      <ApiDialog open={docsOpen} onOpenChange={setDocsOpen} />
    </>
  );
}
