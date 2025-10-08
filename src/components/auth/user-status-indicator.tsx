"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useUser,
} from "@clerk/nextjs";
import { LogOut, Save, Settings, User, UserX } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useThemeContext } from "@/providers/theme";

export function UserStatusIndicator() {
  const { user, isLoaded } = useUser();
  const { userThemes, saveCurrentTheme, unsavedChanges, canSave } =
    useThemeContext();

  const handleSaveTheme = async () => {
    if (!canSave) return;

    const result = await saveCurrentTheme();
    if (result.success) {
      toast.success("Theme saved!");
    } else {
      toast.error("Failed to save theme");
    }
  };

  if (!isLoaded) {
    return (
      <Badge variant="outline" className="gap-1">
        <UserX className="w-3 h-3" />
        Loading...
      </Badge>
    );
  }

  return (
    <>
      <SignedOut>
        <Badge variant="outline" className="gap-1">
          <UserX className="w-3 h-3" />
          Guest
        </Badge>
      </SignedOut>
      <SignedIn>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <Badge variant="default" className="gap-1">
                <User className="w-3 h-3" />
                {user?.fullName ||
                  user?.primaryEmailAddress?.emailAddress ||
                  "User"}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <div className="p-2">
              <p className="text-sm font-medium">{user?.fullName || "User"}</p>
              {user?.primaryEmailAddress?.emailAddress && (
                <p className="text-xs text-muted-foreground">
                  {user.primaryEmailAddress.emailAddress}
                </p>
              )}
              {userThemes.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {userThemes.length} saved theme
                  {userThemes.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>

            <DropdownMenuSeparator />

            {unsavedChanges && canSave && (
              <DropdownMenuItem onClick={handleSaveTheme}>
                <Save className="w-4 h-4 mr-2" />
                Save current theme
              </DropdownMenuItem>
            )}

            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              Account settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <SignOutButton>
              <DropdownMenuItem className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </SignOutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </SignedIn>
    </>
  );
}
