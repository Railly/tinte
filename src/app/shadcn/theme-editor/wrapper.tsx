"use client";

import { useAuth } from "@clerk/nextjs";
import { PaletteIcon } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useShadcnSelectedTheme } from "@/hooks/use-shadcn-selected-theme";

export function ThemeEditorWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { data: selectedTheme } = useShadcnSelectedTheme();
  const { userId } = useAuth();

  const isOwner = React.useMemo(() => {
    return selectedTheme?.userId === userId;
  }, [selectedTheme, userId]);

  if (!selectedTheme || !isOwner) {
    return null;
  }

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className=" w-48">
            <PaletteIcon className="-ml-2 mr-1 size-4" />
            Customize
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[40rem] p-0" align="start">
          {children}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="-translate-x-1/2 fixed bottom-4 left-1/2 z-50 mx-auto w-48">
          <PaletteIcon className="-ml-2 mr-1 size-4" />
          Customize
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mb-2">
        <div className="mx-auto w-full max-w-sm">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
