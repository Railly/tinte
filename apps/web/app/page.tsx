import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
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
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

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
        <div className="flex items-center gap-4">
          <HeaderLogo />
          <Separator orientation="vertical" className="h-4" />
          <SignedIn>
            <Link
              href="/generator"
              className={cn(buttonVariants({ variant: "link" }), "px-0")}
            >
              Generator
            </Link>
          </SignedIn>
          <Link
            href="/gallery"
            className={cn(buttonVariants({ variant: "link" }), "px-0")}
          >
            Gallery
          </Link>
        </div>
        <div className="flex gap-4">
          <ThemeSelector />
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal" forceRedirectUrl="/generator">
                <Button variant="default">Log in</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>
      <ThemeManager initialThemes={themes} />
    </div>
  );
}
