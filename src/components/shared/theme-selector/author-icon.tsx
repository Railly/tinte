"use client";

import { Users } from "lucide-react";
import { RaycastIcon, TweakCNIcon } from "@/components/shared/icons";
import InvertedLogo from "@/components/shared/inverted-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ThemeData } from "@/lib/theme-tokens";

interface AuthorIconProps {
  theme: ThemeData;
  size?: number;
}

export function AuthorIcon({ theme }: AuthorIconProps) {
  if (theme.provider === "tweakcn") {
    return <TweakCNIcon className="w-3 h-3" />;
  }

  if (theme.provider === "rayso") {
    return <RaycastIcon className="w-3 h-3" />;
  }

  if (theme.provider === "tinte") {
    return <InvertedLogo size={12} />;
  }

  if (theme.user?.image) {
    return (
      <Avatar className="w-3 h-3">
        <AvatarImage src={theme.user.image} alt={theme.user.name || "User"} />
        <AvatarFallback className="text-[8px]">
          {(theme.user.name?.[0] || "U").toUpperCase()}
        </AvatarFallback>
      </Avatar>
    );
  }

  if (theme.user?.id) {
    return (
      <Avatar className="w-3 h-3">
        <AvatarFallback className="text-[8px]">
          {(theme.user.name?.[0] || "U").toUpperCase()}
        </AvatarFallback>
      </Avatar>
    );
  }

  return <Users className="w-3 h-3" />;
}
