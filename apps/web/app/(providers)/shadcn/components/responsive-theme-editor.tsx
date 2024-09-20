import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { IconPalette } from "@/components/ui/icons";
import { ThemeGeneratorProperties } from "./theme-generator-properties";
import { Theme } from "@/lib/atoms";
import { useMediaQuery } from "@/lib/hooks/use-media-query";

interface ResponsiveThemeEditorProps {
  currentTheme: Theme;
  setCurrentTheme: React.Dispatch<React.SetStateAction<Theme>>;
  copyCode: (format: "css" | "tailwind" | "json") => void;
}

export function ResponsiveThemeEditor({
  currentTheme,
  setCurrentTheme,
  copyCode,
}: ResponsiveThemeEditorProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const content = (
    <ThemeGeneratorProperties
      shadcnTheme={currentTheme}
      setShadcnTheme={setCurrentTheme}
      copyCode={copyCode}
    />
  );

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <IconPalette className="mr-2 h-4 w-4" />
            Edit Palette
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" side="right" align="start">
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          <IconPalette className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">{content}</div>
      </DrawerContent>
    </Drawer>
  );
}
