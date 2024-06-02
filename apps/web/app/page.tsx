"use client";
import { Button } from "@/components/ui/button";
import { IconPipette } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BACKGROUND_LESS_PALETTE, CODE_SAMPLE, presets } from "@/lib/constants";
import { generateVSCodeTheme } from "@/lib/core";
import { defaultThemeConfig } from "@/lib/core/config";
import { Palette, ThemeConfig } from "@/lib/core/types";
import { useHighlighter } from "@/lib/hooks/use-highlighter";
import { useMonacoEditor } from "@/lib/hooks/use-monaco-editor";
import { cn, debounce } from "@/lib/utils";
import MonacoEditor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { createRef, useRef, useState } from "react";

export default function Page(): JSX.Element {
  const [themeConfig, setThemeConfig] =
    useState<ThemeConfig>(defaultThemeConfig);
  const [code, setCode] = useState<string | undefined>(CODE_SAMPLE);
  const [isBackgroundless, setIsBackgroundless] = useState(false);
  const { theme: nextTheme, systemTheme, setTheme } = useTheme();
  const currentTheme =
    nextTheme === "system" ? systemTheme : (nextTheme as "dark" | "light");
  console.log({ nextTheme, currentTheme, systemTheme });

  const updatePaletteColor = debounce(
    (colorKey: keyof Palette, value: string) => {
      if (!currentTheme) return;
      setThemeConfig((prevConfig) => ({
        ...prevConfig,
        displayName: prevConfig.displayName ? prevConfig.displayName : "Custom",
        palette: {
          ...prevConfig.palette,
          [currentTheme]: {
            ...prevConfig.palette[currentTheme],
            [colorKey]: value,
          },
        },
      }));
    },
    250
  );

  const updateCode = debounce((value: string | undefined) => {
    setCode(value);
  }, 500);

  const applyPreset = (presetName: string) => {
    if (!currentTheme) return;
    // @ts-ignore
    setThemeConfig((prevConfig) => ({
      ...prevConfig,
      displayName: presetName,
      palette: {
        light: isBackgroundless
          ? {
              ...presets[presetName]?.light,
              ...BACKGROUND_LESS_PALETTE.light,
            }
          : presets[presetName]?.light,
        dark: isBackgroundless
          ? {
              ...presets[presetName]?.dark,
              ...BACKGROUND_LESS_PALETTE.dark,
            }
          : presets[presetName]?.dark,
      },
    }));
  };

  const toggleBackgroundless = () => {
    if (!currentTheme) return;
    setIsBackgroundless((prevMode) => !prevMode);
    setThemeConfig((prevConfig) => ({
      ...prevConfig,
      palette: {
        ...prevConfig.palette,
        [currentTheme]: !isBackgroundless
          ? {
              ...prevConfig.palette[currentTheme],
              ...BACKGROUND_LESS_PALETTE[currentTheme],
            }
          : presets[prevConfig.displayName]?.[currentTheme],
      },
    }));
  };

  const exportTheme = () => {
    const jsonString = JSON.stringify(theme, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${themeConfig.displayName}.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  console.log({ themeConfig });
  const theme = generateVSCodeTheme(themeConfig);
  const { highlightedText } = useHighlighter({
    theme,
    text: code,
  });
  const editorRef = useRef<any>(null);
  const { currentThemeName } = useMonacoEditor({ theme });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4 w-full h-full p-8 max-h-screen">
        <div className="flex flex-col gap-4 w-full h-full">
          <h1 className="text-sm font-mono uppercase font-bold">Preview</h1>
          <div className="w-full h-full grid grid-rows-2 gap-4">
            <pre
              className="!w-full overflow-x-auto border bg-background [&>pre]:p-4 text-sm md:!w-full !text-[13px] max-h-[40vh] overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: highlightedText }}
            />
            <MonacoEditor
              className="!h-full !w-full border"
              theme={currentThemeName}
              onMount={(editor) => (editorRef.current = editor)}
              height="100%"
              defaultLanguage="typescript"
              value={code}
              onChange={updateCode}
              options={{
                fontFamily: "Geist Mono",
                fontSize: 13,
                padding: { top: 16 },
                minimap: { enabled: false },
                automaticLayout: true,
                wordWrap: "on",
                formatOnType: true,
                lineDecorationsWidth: 1,
                lineNumbersMinChars: 4,
                tabSize: 2,
              }}
            />
          </div>
        </div>
        <div className="w-full flex flex-col divide-y">
          <div className="flex flex-col w-full h-full gap-4">
            <h1 className="text-sm font-mono uppercase font-bold">
              Configuration
            </h1>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="backgroundless-mode"
                  checked={!isBackgroundless}
                  onCheckedChange={toggleBackgroundless}
                />
                <Label htmlFor="backgroundless-mode">Background</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="light/dark-mode"
                  onCheckedChange={(checked) => {
                    setTheme(checked ? "light" : "dark");
                  }}
                  checked={currentTheme === "light"}
                />
                <Label htmlFor="backgroundless-mode">
                  {currentTheme === "dark" ? "Dark" : "Light"} Mode
                </Label>
              </div>
            </div>
            <div className="flex flex-col gap-2 border p-2">
              <h2 className="text-sm font-mono font-bold">Presets</h2>
              <div className="flex gap-2 flex-wrap">
                {Object.keys(presets).map((presetName) => (
                  <button
                    key={presetName}
                    className={cn(
                      "px-2 py-1 bg-background-2 text-xs font-mono rounded flex gap-2 border border-transparent hover:border-primary dark:hover:border-primary/70 transition-colors duration-200",
                      {
                        "border-primary dark:border-primary/70 bg-muted":
                          themeConfig.displayName === presetName,
                      }
                    )}
                    onClick={() => applyPreset(presetName)}
                  >
                    <span
                      className="w-4 h-4 rounded-full flex"
                      style={{
                        backgroundImage:
                          currentTheme &&
                          `linear-gradient(140deg, ${presets[presetName]?.[currentTheme].primary}, ${presets[presetName]?.[currentTheme].accent})`,
                      }}
                    />
                    <span>{presetName}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2 border p-2">
              <h2 className="text-sm font-mono font-bold">Tokens</h2>
              <div className="grid grid-cols-2">
                {Object.entries(
                  themeConfig.palette[currentTheme as "light" | "dark"]
                ).map(([colorKey, colorValue]) => {
                  const ref = createRef<HTMLInputElement>();
                  return (
                    <div
                      className="w-full flex flex-col font-mono gap-2 py-2"
                      key={colorKey}
                    >
                      <div className="grid grid-cols-[2fr_2fr_3fr] gap-4 items-center">
                        <div
                          className={cn(
                            "relative w-full text-transparent transition-colors duration-200 hover:text-foreground dark:hover:text-foreground/70"
                          )}
                        >
                          <Input
                            type="color"
                            className={cn(
                              "p-1 rounded-full w-full",
                              `[&::-webkit-color-swatch]:p-0 `,
                              `[&::-webkit-color-swatch]:rounded-full`,
                              `[&::-webkit-color-swatch]:border-2`,
                              `[&::-webkit-color-swatch]:border-black/20`,
                              `dark:[&::-webkit-color-swatch]:border-white/20`,
                              `[&::-webkit-color-swatch-wrapper]:p-0 border-none`,
                              "cursor-pointer"
                            )}
                            value={colorValue}
                            onChange={(e) =>
                              updatePaletteColor(
                                colorKey as keyof Palette,
                                e.target.value
                              )
                            }
                            name={colorKey}
                            ref={ref}
                          />
                          <IconPipette
                            className="absolute top-[calc(50%-0.5rem)] left-[calc(50%-0.5rem)] cursor-pointer"
                            onClick={() => {
                              if (ref.current) {
                                ref.current.click();
                              }
                            }}
                          />
                        </div>
                        <Input
                          className="font-mono"
                          value={colorValue}
                          onChange={(e) =>
                            updatePaletteColor(
                              colorKey as keyof Palette,
                              e.target.value
                            )
                          }
                          name={colorKey}
                          ref={ref}
                        />
                        <label
                          htmlFor={colorKey}
                          className="text-xs text-foreground"
                        >
                          {colorKey}
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-2 w-full">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => {
                  const jsonString = JSON.stringify(
                    themeConfig.palette[currentTheme as "light" | "dark"],
                    null,
                    2
                  );
                  navigator.clipboard.writeText(jsonString);
                }}
              >
                Copy Palette
              </Button>
              <Button className="w-full" onClick={exportTheme}>
                Export VSCode Theme
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
