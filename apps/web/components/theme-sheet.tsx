/* eslint-disable @next/next/no-img-element */
// components/ThemeSheet.tsx
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { CircularGradient } from "@/components/circular-gradient";
import { IconUser } from "./ui/icons";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { DarkLightPalette, ThemeConfig } from "@/lib/core/types";
import { useBinaryTheme } from "@/lib/hooks/use-binary-theme";
import { isThemeOwner } from "@/app/utils";

interface ThemeSheetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  themes: ThemeConfig[];
  onSelectTheme: (themeName: string, palette: DarkLightPalette) => void;
}

export const ThemeSheet: React.FC<ThemeSheetProps> = ({
  isOpen,
  setIsOpen,
  themes,
  onSelectTheme,
}) => {
  const { currentTheme } = useBinaryTheme();
  const user = useUser();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="w-10 h-10" variant="outline" size="icon">
          <HamburgerMenuIcon className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] top-14 left-16 p-0">
        <div className="py-4 z-[55]">
          <h2 className="text-sm font-bold border-b pb-4 px-4 mb-4">
            Your Themes
          </h2>
          {themes.filter(
            (theme) =>
              theme.category === "user" && isThemeOwner(user.user?.id, theme)
          ).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <SignedIn>
                <img
                  src={user.user?.imageUrl}
                  className="w-12 h-12 mb-4 rounded-full"
                  alt="User avatar"
                />
              </SignedIn>
              <SignedOut>
                <IconUser className="w-12 h-12 mb-4 text-muted-foreground" />
              </SignedOut>
              <h3 className="text-lg font-semibold mb-2">
                No Custom Themes Yet
              </h3>
              <p className="text-sm text-muted-foreground">
                Create your first theme to see it here.
              </p>
            </div>
          ) : (
            themes.map(
              (theme) =>
                theme.category === "user" && (
                  <div
                    key={theme.name}
                    className="flex items-center justify-between px-2 mx-2 py-1 mb-2 rounded-md cursor-pointer hover:bg-primary/10"
                    onClick={() => {
                      onSelectTheme(theme.displayName, theme.palette);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <CircularGradient palette={theme.palette[currentTheme]} />
                      <span className="truncate text-sm max-w-[13rem]">
                        {theme.displayName}
                      </span>
                    </div>
                  </div>
                )
            )
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
