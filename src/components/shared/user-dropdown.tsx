"use client";

import { LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";

interface UserDropdownProps {
  className?: string;
  avatarSize?: "sm" | "md";
}

export function UserDropdown({
  className,
  avatarSize = "md",
}: UserDropdownProps) {
  const { data: session, isPending } = authClient.useSession();

  const avatarSizeClass = avatarSize === "sm" ? "h-8 w-8" : "h-10 w-10";
  const skeletonSizeClass = avatarSize === "sm" ? "h-8 w-8" : "h-10 w-10";

  if (isPending) {
    return (
      <Skeleton className={`${skeletonSizeClass} rounded-full ${className}`} />
    );
  }

  if (!session) {
    return (
      <Button
        size="sm"
        className="h-7 px-3 text-xs"
        variant="outline"
        onClick={() => authClient.signIn.social({
          provider: "github",
          callbackURL: window.location.href
        })}
      >
        Sign In
      </Button>
    );
  }

  const userInitial = (session.user.name || session.user.email || "U")
    .charAt(0)
    .toUpperCase();
  const displayName = session.user.name || session.user.email || "User";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`p-0 ${className}`}>
          <Avatar className={avatarSizeClass}>
            <AvatarImage src={session.user.image || ""} alt={displayName} />
            <AvatarFallback
              className={avatarSize === "sm" ? "text-xs" : "text-sm"}
            >
              {userInitial}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            {session.user.email && (
              <p className="text-xs leading-none text-muted-foreground">
                {session.user.email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => authClient.signOut()}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
