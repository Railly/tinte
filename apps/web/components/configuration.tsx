import { Button, buttonVariants } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ThemeConfig, Palette } from "@/lib/core/types";
import { cn, entries } from "@/lib/utils";
import { PresetSelector } from "@/components/preset-selector";
import { TokenEditor } from "@/components/token-editor";
import {
  ResponsiveModal,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "./ui/responsive-modal";
import { IconHeart, IconInfo, IconLoading } from "./ui/icons";

interface ConfigurationProps {
  loading: boolean;
  themeConfig: ThemeConfig;
  currentTheme: "light" | "dark";
  isBackgroundless: boolean;
  onBackgroundlessChange: () => void;
  onThemeChange: (checked: boolean) => void;
  onPaletteColorChange: (colorKey: keyof Palette, value: string) => void;
  onPresetSelect: (presetName: string) => void;
  onCopyPalette: () => void;
  onExportTheme: () => void;
  presets: Record<string, any>;
}

export const Configuration = ({
  loading,
  themeConfig,
  currentTheme,
  isBackgroundless,
  onBackgroundlessChange,
  onThemeChange,
  onPaletteColorChange,
  onPresetSelect,
  onCopyPalette,
  onExportTheme,
  presets,
}: ConfigurationProps) => {
  return (
    <div className="w-full flex flex-col divide-y">
      <div className="flex flex-col divide-y">
        <div className="flex flex-col w-full h-full gap-4">
          <h1 className="text-sm font-mono uppercase font-bold">
            Configuration
          </h1>
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center space-x-2">
              <Switch
                id="backgroundless-mode"
                checked={!isBackgroundless}
                onCheckedChange={onBackgroundlessChange}
              />
              <Label htmlFor="backgroundless-mode">Background</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="light/dark-mode"
                onCheckedChange={onThemeChange}
                checked={currentTheme === "light"}
              />
              <Label htmlFor="light/dark-mode">
                {currentTheme === "dark" ? "Dark" : "Light"} Mode
              </Label>
            </div>
            <ResponsiveModal
              trigger={
                <Button variant="outline">
                  <IconInfo className="mr-2" />
                  <span>How to Set Theme in VSCode</span>
                </Button>
              }
            >
              <ResponsiveModalHeader>
                <ResponsiveModalTitle>
                  How to Set Theme in VSCode
                </ResponsiveModalTitle>
              </ResponsiveModalHeader>
              <ResponsiveModalDescription className="prose dark:prose-invert prose-neutral text-foreground leading-5">
                <p>Ready to take your coding to the next level?</p>
                <ol className="flex flex-col gap-2">
                  <li>
                    Export your favorite theme using the "Export VSCode Theme"
                    button.
                  </li>
                  <li>
                    Go to VSCode and open the command palette by pressing{" "}
                    <kbd>Ctrl+Shift+P</kbd> (Windows/Linux) or{" "}
                    <kbd>Cmd+Shift+P</kbd> (Mac).
                  </li>
                  <li>
                    Type "VSIX" and select{" "}
                    <b>"Extensions: Install from VSIX"</b>.
                  </li>
                  <li>
                    Choose the exported theme file and let VSCode work its
                    magic.
                  </li>
                  <li>
                    Go to the Extensions view, find your shiny new theme, and
                    click "Set Color Theme" to activate it.
                  </li>
                </ol>
                <p className="mt-4 mb-8">
                  Congratulations! Enjoy your personalized VSCode experience and
                  let your creativity soar. Happy coding!
                </p>
                <div className="flex gap-2 w-full">
                  <a
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "flex w-full items-center gap-2 no-underline"
                    )}
                    href="https://donate.railly.dev"
                    target="_blank"
                  >
                    <IconHeart />
                    Support me
                  </a>
                  <a
                    href="https://www.railly.dev"
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "flex w-full items-center gap-2 no-underline"
                    )}
                  >
                    Know more about me
                  </a>
                </div>
              </ResponsiveModalDescription>
            </ResponsiveModal>
          </div>

          <PresetSelector
            presets={presets}
            currentTheme={currentTheme}
            selectedPreset={themeConfig.displayName}
            onPresetSelect={onPresetSelect}
          />

          <div className="flex flex-col gap-2 border p-2">
            <h2 className="text-sm font-mono font-bold">Tokens</h2>
            <div className="grid grid-cols-2 gap-4 md:gap-0">
              {currentTheme &&
                entries(themeConfig.palette[currentTheme]).map(
                  ([colorKey, colorValue]) => (
                    <div
                      className="w-full flex flex-col font-mono gap-2 py-2"
                      key={colorKey}
                    >
                      <TokenEditor
                        colorKey={colorKey}
                        colorValue={colorValue}
                        onColorChange={(value) =>
                          onPaletteColorChange(colorKey as keyof Palette, value)
                        }
                      />
                    </div>
                  )
                )}
            </div>
          </div>

          <div className="flex gap-2 w-full mb-4 md:mb-0">
            <Button
              className="w-full"
              variant="outline"
              onClick={onCopyPalette}
            >
              Copy Palette
            </Button>
            <Button
              className="w-full"
              onClick={onExportTheme}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <IconLoading className="animate-spin" />
                  <span>Exporting...</span>
                </div>
              ) : (
                <span>Export VSCode Theme</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
