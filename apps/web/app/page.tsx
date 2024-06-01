"use client";
import { Button } from "@/components/ui/button";
import { IconPipette } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SAMPLE_CODE } from "@/lib/constants";
import { generateVSCodeTheme } from "@/lib/core";
import { defaultThemeConfig } from "@/lib/core/config";
import { Palette, ThemeConfig } from "@/lib/core/types";
import { useHighlighter } from "@/lib/hooks/use-highlighter";
import { useMonacoEditor } from "@/lib/hooks/use-monaco-editor";
import { cn, debounce } from "@/lib/utils";
import MonacoEditor from "@monaco-editor/react";
import { createRef, useRef, useState } from "react";

const presets: Record<string, Palette> = {
  "One Hunter": {
    text: "#E3E1E1",
    "text-2": "#A3A3A3",
    "text-3": "#8F8F8F",
    interface: "#35373A",
    "interface-2": "#3E4043",
    "interface-3": "#47494D",
    background: "#1D2127",
    "background-2": "#2C2E31",
    primary: "#F06293",
    secondary: "#E3E1E1",
    accent: "#50C2F7",
    "accent-2": "#66DFC4",
    "accent-3": "#F7BC62",
  },
  Flexoki: {
    text: "#CECDC3",
    "text-2": "#87857F",
    "text-3": "#575653",
    interface: "#282726",
    "interface-2": "#343331",
    "interface-3": "#403E3C",
    background: "#100F0F",
    "background-2": "#1C1B1A",
    primary: "#889A39",
    secondary: "#CE5D97",
    accent: "#DA702C",
    "accent-2": "#39A99F",
    "accent-3": "#4485BE",
  },
  Vercel: {
    text: "#EDEDED",
    "text-2": "#A3A3A3",
    "text-3": "#8F8F8F",
    interface: "#171717",
    "interface-2": "#212121",
    "interface-3": "#2B2B2B",
    background: "#000000",
    "background-2": "#0D0D0D",
    primary: "#FF4C8D",
    secondary: "#47A8FF",
    accent: "#C372FC",
    "accent-2": "#00CA51",
    "accent-3": "#EDEDED",
  },
  Supabase: {
    text: "#FFFFFF",
    "text-2": "#A3A3A3",
    "text-3": "#8F8F8F",
    interface: "#262c29",
    "interface-2": "#343c38",
    "interface-3": "#4e5651",
    background: "#171717",
    "background-2": "#212121",
    primary: "#A0A0A0",
    secondary: "#3ECF8E",
    accent: "#3ECF8E",
    "accent-2": "#3ECF8E",
    "accent-3": "#EDEDED",
  },
  Bitmap: {
    text: "#FFFFFF",
    "text-2": "#A3A3A3",
    "text-3": "#8F8F8F",
    interface: "#3c2020",
    "interface-2": "#512f2f",
    "interface-3": "#6f4444",
    background: "#190707",
    "background-2": "#280b0b",
    primary: "#EB6F6F",
    secondary: "#E42C37",
    accent: "#E42C37",
    "accent-2": "#EBB99D",
    "accent-3": "#E42C37",
  },
  Noir: {
    text: "#FFFFFF",
    "text-2": "#A3A3A3",
    "text-3": "#8F8F8F",
    interface: "#2b2b2b",
    "interface-2": "#363636",
    "interface-3": "#454545",
    background: "#181818",
    "background-2": "#1f1f1f",
    primary: "#A7A7A7",
    secondary: "#A7A7A7",
    accent: "#FFFFFF",
    "accent-2": "#A7A7A7",
    "accent-3": "#FFFFFF",
  },
  Ice: {
    text: "#FFFFFF",
    "text-2": "#A3A3A3",
    "text-3": "#8F8F8F",
    interface: "#30353b",
    "interface-2": "#394047",
    "interface-3": "#515a61",
    background: "#1F2427",
    "background-2": "#272c30",
    primary: "#BFC4C8",
    secondary: "#92DEF6",
    accent: "#778CB7",
    "accent-2": "#89C3DC",
    "accent-3": "#00B0E9",
  },
  Sand: {
    text: "#FFFFFF",
    "text-2": "#A3A3A3",
    "text-3": "#8F8F8F",
    interface: "#484037",
    "interface-2": "#584f46",
    "interface-3": "#66594d",
    background: "#2E2820",
    "background-2": "#393228",
    primary: "#D3B48C",
    secondary: "#C2B181",
    accent: "#F4A461",
    "accent-2": "#EED5B8",
    "accent-3": "#C2B181",
  },
  Forest: {
    text: "#FFFFFF",
    "text-2": "#A3A3A3",
    "text-3": "#8F8F8F",
    interface: "#2b312b",
    "interface-2": "#3c443d",
    "interface-3": "#4b534d",
    background: "#141815",
    "background-2": "#1e2420",
    primary: "#AAB4A2",
    secondary: "#6A8F71",
    accent: "#86B882",
    "accent-2": "#CBBE6D",
    "accent-3": "#AAB4A2",
  },
  Breeze: {
    text: "#FFFFFF",
    "text-2": "#A3A3A3",
    "text-3": "#8F8F8F",
    interface: "#3a2442",
    "interface-2": "#472f4c",
    "interface-3": "#5f4365",
    background: "#1e0d21",
    "background-2": "#2b132f",
    primary: "#69F",
    secondary: "#49E8F2",
    accent: "#F8528D",
    "accent-2": "#E9AEFE",
    "accent-3": "#55E7B1",
  },
  Candy: {
    text: "#FFFFFF",
    "text-2": "#A3A3A3",
    "text-3": "#8F8F8F",
    interface: "#443856",
    "interface-2": "#4f4266",
    "interface-3": "#66597d",
    background: "#2B2536",
    "background-2": "#352d43",
    primary: "#FF659C",
    secondary: "#1CC8FF",
    accent: "#73DFA5",
    "accent-2": "#DFD473",
    "accent-3": "#7A7FFD",
  },
  Crimson: {
    text: "#FFFFFF",
    "text-2": "#A3A3A3",
    "text-3": "#8F8F8F",
    interface: "#362626",
    "interface-2": "#533c3d",
    "interface-3": "#7e6363",
    background: "#211111",
    "background-2": "#2f1818",
    primary: "#EB6F6F",
    secondary: "#D15510",
    accent: "#C88E8E",
    "accent-2": "#EBB99D",
    "accent-3": "#FDA97A",
  },
  Falcon: {
    text: "#FFFFFF",
    "text-2": "#A3A3A3",
    "text-3": "#8F8F8F",
    interface: "#272525",
    "interface-2": "#2c2a2a",
    "interface-3": "#454545",
    background: "#121212",
    "background-2": "1c1c1c",
    primary: "#99B6B2",
    secondary: "#799DB1",
    accent: "#6D88BB",
    "accent-2": "#789083",
    "accent-3": "#BD9C9C",
  },
  Meadow: {
    text: "#EDEDED",
    "text-2": "#A3A3A3",
    "text-3": "#8F8F8F",
    interface: "#2a2b27",
    "interface-2": "#464b3a",
    "interface-3": "#6d725f",
    background: "#11130b",
    "background-2": "#1a1e10",
    primary: "#6DD79F",
    secondary: "#E4B164",
    accent: "#B3D767",
    "accent-2": "#E9EB9D",
    "accent-3": "#45B114",
  },
  Midnight: {
    text: "#FFFFFF",
    "text-2": "#A3A3A3",
    "text-3": "#8F8F8F",
    interface: "#283234",
    "interface-2": "#364245",
    "interface-3": "#526366",
    background: "#121E20",
    "background-2": "#18282a",
    primary: "#7DA9AB",
    secondary: "#9681C2",
    accent: "#52D0F8",
    "accent-2": "#6D86A4",
    "accent-3": "#75D2B1",
  },
  Raindrop: {
    text: "#EDEDED",
    "text-2": "#A3A3A3",
    "text-3": "#8F8F8F",
    interface: "#232934",
    "interface-2": "#363f4f",
    "interface-3": "#5b6576",
    background: "#070f1D",
    "background-2": "#0b172d",
    primary: "#2FD9FF",
    secondary: "#008BB7",
    accent: "#19D6B5",
    "accent-2": "#9CD8EB",
    "accent-3": "#9984EE",
  },
  Sunset: {
    text: "#EDEDED",
    "text-2": "#A3A3A3",
    "text-3": "#8F8F8F",
    interface: "#2c2721",
    "interface-2": "#4a4036",
    "interface-3": "#7c6b5a",
    background: "#231c15",
    "background-2": "#2d241b",
    primary: "#FFAF64",
    secondary: "#E978A1",
    accent: "#E2D66B",
    "accent-2": "#F9D38C",
    "accent-3": "#E7CF55",
  },
};

const BACKGROUND_LESS_PALETTE = {
  text: "#EDEDED",
  "text-2": "#A3A3A3",
  "text-3": "#8F8F8F",
  interface: "#171717",
  "interface-2": "#212121",
  "interface-3": "#2B2B2B",
  background: "#000000",
  "background-2": "#0D0D0D",
};

export default function Page(): JSX.Element {
  const [themeConfig, setThemeConfig] =
    useState<ThemeConfig>(defaultThemeConfig);
  const [code, setCode] = useState<string | undefined>(SAMPLE_CODE);
  const [isBackgroundless, setIsBackgroundless] = useState(false);

  const updatePaletteColor = debounce(
    (colorKey: keyof Palette, value: string) => {
      setThemeConfig((prevConfig) => ({
        ...prevConfig,
        displayName: prevConfig.displayName ? prevConfig.displayName : "Custom",
        palette: {
          ...prevConfig.palette,
          [colorKey]: value,
        },
      }));
    },
    250
  );

  const updateCode = debounce((value: string | undefined) => {
    setCode(value);
  }, 500);

  const applyPreset = (presetName: string) => {
    // @ts-ignore
    setThemeConfig((prevConfig) => ({
      ...prevConfig,
      displayName: presetName,
      palette: !isBackgroundless
        ? {
            ...presets[presetName],
          }
        : {
            ...presets[presetName],
            ...BACKGROUND_LESS_PALETTE,
          },
    }));
  };

  const toggleBackgroundless = () => {
    setIsBackgroundless((prevMode) => !prevMode);
    console.log({ themeConfig });
    // @ts-ignore
    setThemeConfig((prevConfig) => ({
      ...prevConfig,
      palette: !isBackgroundless
        ? {
            ...prevConfig.palette,
            ...BACKGROUND_LESS_PALETTE,
          }
        : presets[prevConfig.displayName],
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

  const theme = generateVSCodeTheme(themeConfig);
  const { highlightedText } = useHighlighter({
    theme,
    text: code,
  });
  const editorRef = useRef<any>(null);
  const { currentTheme } = useMonacoEditor({ theme });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4 w-full h-full p-8 max-h-screen">
        <div className="flex flex-col gap-4 w-full h-full">
          <h1 className="text-sm font-mono uppercase font-bold">Preview</h1>
          <div className="w-full h-full grid grid-rows-2 gap-4">
            <pre
              className="!w-full overflow-x-auto border bg-background [&>pre]:p-4 text-sm md:!w-full text-[13px] max-h-[40vh] overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: highlightedText }}
            />
            <MonacoEditor
              className="!h-full !w-full border"
              theme={currentTheme}
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
                  checked={isBackgroundless}
                  onCheckedChange={toggleBackgroundless}
                />
                <Label htmlFor="backgroundless-mode">Backgroundless Mode</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="light/dark-mode"
                  onCheckedChange={() => {}}
                  disabled
                  checked
                />
                <Label htmlFor="backgroundless-mode">
                  {themeConfig.type === "dark" ? "Dark" : "Light"} Mode (WIP)
                </Label>
              </div>
            </div>
            <div className="flex flex-col gap-2 border p-2">
              <h2 className="text-sm font-mono font-bold">Presets</h2>
              <div className="flex gap-2 flex-wrap">
                {Object.keys(presets).map((presetName) => (
                  <button
                    key={presetName}
                    className="px-2 py-1 bg-background-2 text-xs font-mono rounded flex gap-2"
                    onClick={() => applyPreset(presetName)}
                  >
                    <span
                      className="w-4 h-4 rounded-full flex"
                      style={{
                        // @ts-ignore
                        backgroundImage: `linear-gradient(140deg, ${presets[presetName].primary}, ${presets[presetName].accent})`,
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
                {Object.entries(themeConfig.palette).map(
                  ([colorKey, colorValue]) => {
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
                  }
                )}
              </div>
            </div>
            <div className="flex w-full">
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
