"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
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

interface UserDropdownProps {
  className?: string;
  avatarSize?: "sm" | "md";
}

export function UserDropdown({
  className,
  avatarSize = "md",
}: UserDropdownProps) {
  const { isLoaded } = useUser();

  const avatarSizeClass = avatarSize === "sm" ? "h-8 w-8" : "h-10 w-10";
  const skeletonSizeClass = avatarSize === "sm" ? "h-8 w-8" : "h-10 w-10";

  if (!isLoaded) {
    return (
      <Skeleton className={`${skeletonSizeClass} rounded-full ${className}`} />
    );
  }

  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <Button size="sm" className="h-7 px-3 text-xs" variant="outline">
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              avatarBox: avatarSizeClass,
            },
          }}
        />
      </SignedIn>
    </>
  );
}
