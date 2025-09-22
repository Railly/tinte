"use client";

import { MoreHorizontal, Share } from "lucide-react";
import { toast } from "sonner";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DiscordIcon from "./icons/discord";
import GithubIcon from "./icons/github";
import TwitterIcon from "./icons/twitter";

export function SocialsDropdown() {
  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Tinte - Theme Converter",
          url: url,
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast.success("URL copied to clipboard");
      } catch (error) {
        toast.error("Failed to copy URL");
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">More options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleShare} className="flex items-center gap-2">
          <Share className="h-4 w-4" />
          Share
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <GithubIcon className="h-4 w-4 [&>path]:!fill-muted-foreground" />
            GitHub
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <TwitterIcon className="h-4 w-4 [&>path]:!fill-muted-foreground" />
            Twitter
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={siteConfig.links.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <DiscordIcon className="h-4 w-4 [&>path]:!fill-muted-foreground" />
            Discord
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}