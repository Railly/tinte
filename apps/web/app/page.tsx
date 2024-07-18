import React from "react";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { ThemeSelector } from "@/components/theme-selector";
import { ThemeManager } from "@/components/theme-manager";
import { HeaderLogo } from "@/components/header-logo";
import { PrismaClient } from "@prisma/client";
import { ThemeConfig } from "@/lib/core/types";
import { formatTheme, sortThemes } from "./utils.";

const prisma = new PrismaClient();

async function getThemes() {
  const themes = await prisma.themes.findMany({
    include: {
      ThemePalettes: true,
      TokenColors: true,
    },
  });

  prisma.$disconnect();

  return sortThemes(themes.map(formatTheme) as ThemeConfig[]);
}

export default async function Page() {
  const themes = await getThemes();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex h-14 items-center justify-between p-4 bg-background-2 border-b">
        <HeaderLogo />
        <ThemeSelector />
        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost">Log in</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="default">Get started</Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>
      <ThemeManager initialThemes={themes} />
    </div>
  );
}
