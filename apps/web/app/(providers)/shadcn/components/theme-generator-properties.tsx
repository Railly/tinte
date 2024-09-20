import React, { useState } from "react";
import { useTheme } from "next-themes";
import { useUser } from "@clerk/nextjs";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ColorPickerInput from "@/components/color-picker-input";
import { Theme } from "@/lib/atoms";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Loader2, Copy } from "lucide-react";
import { ThemePresetSelector } from "./theme-preset-selector";
import { ShadcnThemes } from "@prisma/client";
import { convertShadcnThemeToTheme, getThemeName } from "@/app/utils";

interface ThemeGeneratorPropertiesProps {
  shadcnTheme: Theme;
  setShadcnTheme: React.Dispatch<React.SetStateAction<Theme>>;
  copyCode: (format: "css" | "tailwind" | "json") => void;
}

const radiusValues = ["0", "0.3", "0.5", "0.75", "1.0"];

export function ThemeGeneratorProperties({
  shadcnTheme,
  setShadcnTheme,
  copyCode,
}: ThemeGeneratorPropertiesProps) {
  const { resolvedTheme } = useTheme();
  const { user } = useUser();
  const isOwner = user?.id === shadcnTheme.user;
  const [isSaving, setIsSaving] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const handleColorChange =
    (key: keyof Theme["light"] | keyof Theme["dark"]) =>
    (color: { h: number; s: number; l: number; a: number }) => {
      setShadcnTheme((prev) => ({
        ...prev,
        [resolvedTheme === "dark" ? "dark" : "light"]: {
          ...prev[resolvedTheme === "dark" ? "dark" : "light"],
          [key]: color,
        },
      }));
    };

  const handleChartChange =
    (key: keyof Theme["charts"]["light"] | keyof Theme["charts"]["dark"]) =>
    (color: { h: number; s: number; l: number; a: number }) => {
      setShadcnTheme((prev) => ({
        ...prev,
        charts: {
          ...prev.charts,
          [resolvedTheme === "dark" ? "dark" : "light"]: {
            ...prev.charts[resolvedTheme === "dark" ? "dark" : "light"],
            [key]: color,
          },
        },
      }));
    };

  const handleSaveTheme = async () => {
    if (!user || !shadcnTheme.id) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/shadcn/${shadcnTheme.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          name: shadcnTheme.name,
          display_name: shadcnTheme.displayName,
          light_scheme: shadcnTheme.light,
          dark_scheme: shadcnTheme.dark,
          radius: shadcnTheme.radius,
          charts: shadcnTheme.charts,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save theme");
      }

      await response.json();
      toast.success("Theme saved successfully!");
    } catch (error) {
      console.error("Error saving theme:", error);
      toast.error("Failed to save theme");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMakeCopy = async () => {
    if (!user) return;

    setIsCopying(true);
    try {
      const response = await fetch("/api/shadcn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...shadcnTheme,
          name: getThemeName(shadcnTheme.displayName),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create theme copy");
      }

      const newTheme = await response.json();
      setShadcnTheme(convertShadcnThemeToTheme(newTheme));
      toast.success("Theme copy created successfully!");
    } catch (error) {
      console.error("Error creating theme copy:", error);
      toast.error("Failed to create theme copy");
    } finally {
      setIsCopying(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShadcnTheme((prev) => ({
      ...prev,
      displayName: e.target.value,
    }));
  };

  const currentTheme =
    resolvedTheme === "dark" ? shadcnTheme.dark : shadcnTheme.light;
  const currentChartTheme =
    resolvedTheme === "dark"
      ? shadcnTheme.charts.dark
      : shadcnTheme.charts.light;

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="space-y-2 pr-0.5">
        <div className="flex justify-between bg-muted px-4 py-1.5 items-center rounded-t-md w-full">
          <h2 className="text-sm font-bold">Properties</h2>
          <div className="flex gap-2">
            {isOwner ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSaveTheme}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Theme"
                )}
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleMakeCopy}
                disabled={isCopying}
              >
                {isCopying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Copying...
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Make a Copy
                  </>
                )}
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                toast.info("Copied CSS to clipboard!");
                copyCode("css");
              }}
            >
              Copy Code
            </Button>
          </div>
        </div>

        <div className="px-4 pb-3">
          <Label htmlFor="theme-name" className="text-xs">
            Theme Name
          </Label>
          <Input
            id="theme-name"
            value={shadcnTheme.displayName}
            onChange={handleNameChange}
            className="mt-1"
          />
        </div>

        <div className="px-4 pb-3">
          <Label className="text-xs">Radius (rem)</Label>
          <div className="flex gap-2 mt-1">
            {radiusValues.map((value) => (
              <Button
                key={value}
                variant={shadcnTheme.radius === value ? "default" : "outline"}
                size="sm"
                className="flex-1 px-0"
                onClick={() =>
                  setShadcnTheme((prev) => ({ ...prev, radius: value }))
                }
              >
                {value}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold bg-muted px-4 py-2.5">
            Theme Colors
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-4 pb-3">
            {Object.entries(currentTheme).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-2">
                <Label className="text-xs">{key}</Label>
                <ColorPickerInput
                  color={value}
                  onChange={handleColorChange(key as keyof Theme["light"])}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold bg-muted px-4 py-2.5">
            Chart Colors
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-4 pb-4">
            {Object.entries(currentChartTheme).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <Label className="text-xs">{key}</Label>
                <ColorPickerInput
                  color={value}
                  onChange={handleChartChange(
                    key as keyof Theme["charts"]["light"],
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
