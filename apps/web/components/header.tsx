import {
  IconTinte,
  IconGithub,
  IconHeart,
  IconSave,
  IconGenerate,
  IconExport,
  IconShare,
  IconEdit,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { ThemeSelector } from "@/components/theme-selector";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button, buttonVariants } from "./ui/button";
import { SubscriptionForm } from "./subscription-form";
import { Input } from "./ui/input";
import { useState } from "react";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

export const Header = () => {
  const user = useUser();
  const [themeName, setThemeName] = useState("Untitled Theme");

  const handleSave = () => {
    // Implement save functionality
    console.log("Saving theme:", themeName);
  };

  const handleGenerate = () => {
    // Open AI generation modal
    console.log("Opening AI generation modal");
  };

  const handleExport = () => {
    // Open export modal or dropdown
    console.log("Opening export options");
  };

  return (
    <TooltipProvider>
      <header className="flex items-center justify-between gap-4 py-2 px-4 h-14 border-b">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <IconTinte />
            <h1 className="text-md font-bold">tinte</h1>
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "link" }), "px-0")}
            >
              Home
            </Link>
            <Link
              href="/gallery"
              className={cn(buttonVariants({ variant: "link" }), "px-0")}
            >
              Gallery
            </Link>
          </div>
        </div>
        <div className="flex-grow max-w-sm mx-4"></div>
        <div className="flex items-center gap-2">
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" onClick={handleSave}>
                <IconSave />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-xs">Save Theme</span>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" onClick={handleGenerate}>
                <IconGenerate />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-xs">Generate with AI</span>
            </TooltipContent>
          </Tooltip> */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button disabled className="mr-2" variant="outline">
                <IconShare />
                <span className="ml-2">Share</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-xs">Share Theme</span>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleExport}>
                <IconExport />
                <span className="ml-2">Export</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-xs">Export Theme</span>
            </TooltipContent>
          </Tooltip>
          {/* Profile Template with initials RH */}
          <Separator orientation="vertical" className="h-4 mx-2" />
          <div className="w-8 h-8 flex justify-center items-center">
            {!user.isLoaded ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            ) : (
              <UserButton />
            )}
          </div>
          {/* <ThemeSelector /> */}
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <a
                className={cn(buttonVariants({ variant: "ghost" }))}
                href="https://donate.railly.dev"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconHeart />
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-xs">Support</span>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                className={cn(buttonVariants({ variant: "ghost" }))}
                href="https://github.com/Railly/tinte"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconGithub className="text-foreground" />
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-xs">Github</span>
            </TooltipContent>
          </Tooltip> */}
          {/* <SubscriptionForm /> */}
        </div>
      </header>
    </TooltipProvider>
  );
};
