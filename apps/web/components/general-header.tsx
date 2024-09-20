"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { IconGithub, IconPalette } from "@/components/ui/icons";
import { BrowserThemeSelector } from "@/components/browser-theme-selector";
import { AchievementBanner } from "./achievement-banner";
import { RHTinteLinkLogo } from "./atom/rh-tinte-link-logo";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "./ui/badge";

interface HeaderAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component?: React.ReactNode;
  onClick?: () => void;
}

interface GeneralHeaderProps {
  actions?: HeaderAction[];
}

export const GeneralHeader: React.FC<GeneralHeaderProps> = ({
  actions = [],
}) => {
  const navLinks = [
    { href: "/vscode", label: "VS Code", icon: IconPalette },
    { href: "/shadcn", label: "Shadcn UI", icon: IconPalette, isNew: true },
    {
      href: "https://github.com/Railly/tinte",
      label: "Repository",
      icon: IconGithub,
    },
  ];

  return (
    <TooltipProvider>
      <AchievementBanner />
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex sticky top-0 items-center justify-between py-2 px-4 h-14 border-b bg-background z-[25]"
      >
        <div className="flex items-center gap-4">
          <RHTinteLinkLogo />
          <Separator orientation="vertical" className="h-4 hidden md:block" />
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href} isNew={link.isNew}>
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {actions.map((action, index) => (
            <React.Fragment key={index}>
              {action.component ? (
                action.component
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={action.onClick}
                  className="hidden md:flex items-center"
                >
                  <action.icon className="mr-2 h-4 w-4" />
                  {action.label}
                </Button>
              )}
            </React.Fragment>
          ))}
          <div className="hidden md:block">
            <BrowserThemeSelector />
          </div>
          <Separator
            orientation="vertical"
            className="h-4 mx-2 hidden md:block"
          />
          <div className="flex justify-center items-center">
            <SignedOut>
              <SignInButton mode="modal" forceRedirectUrl="/vscode">
                <Button size="sm" variant="default">
                  Log in
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
          <div className="md:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HamburgerMenuIcon className="size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0" align="end">
                <div className="space-y-2 p-2">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.href}
                      href={link.href}
                      className="flex items-center px-2 py-1 rounded-md text-sm font-medium w-full"
                      isNew={link.isNew}
                    >
                      <link.icon className="w-4 h-4 mr-2" />
                      {link.label}
                    </NavLink>
                  ))}
                  {actions.map((action, index) => (
                    <React.Fragment key={index}>
                      {action.component ? (
                        action.component
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={action.onClick}
                          className="flex items-center w-full justify-start"
                        >
                          <action.icon className="mr-2 h-4 w-4" />
                          {action.label}
                        </Button>
                      )}
                    </React.Fragment>
                  ))}
                  <div className="pt-2">
                    <BrowserThemeSelector />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </motion.header>
    </TooltipProvider>
  );
};

function NavLink({
  href,
  children,
  className,
  isNew,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  isNew?: boolean;
}) {
  return (
    <div className="inline-flex items-center gap-2 w-full">
      <Link className="w-full" href={href}>
        <motion.span
          className={cn(
            buttonVariants({ variant: "link" }),
            "px-0 text-muted-foreground hover:text-foreground relative w-full",
            className,
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {children}
        </motion.span>
      </Link>
      <div>
        {isNew && (
          <Badge
            variant="default"
            className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            New
          </Badge>
        )}
      </div>
    </div>
  );
}
