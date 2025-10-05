"use client";

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
import { authClient } from "@/lib/auth-client";
import { useThemeContext } from "@/providers/theme";

export function UserStatusIndicator() {
  const {
    user,
    isAuthenticated,
    userThemes,
    saveCurrentTheme,
    unsavedChanges,
    canSave,
  } = useThemeContext();

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success("Signed out successfully");
      window.location.reload();
    } catch (_error) {
      toast.error("Failed to sign out");
    }
  };

  const handleSaveTheme = async () => {
    if (!canSave) return;

    const result = await saveCurrentTheme();
    if (result.success) {
      toast.success("Theme saved!");
    } else {
      toast.error("Failed to save theme");
    }
  };

  if (!isAuthenticated) {
    return (
      <Badge variant="outline" className="gap-1">
        <UserX className="w-3 h-3" />
        Guest
      </Badge>
    );
  }

  if (isAuthenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <Badge variant="default" className="gap-1">
              <User className="w-3 h-3" />
              {user?.name || user?.email || "User"}
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <div className="p-2">
            <p className="text-sm font-medium">{user?.name || "User"}</p>
            {user?.email && (
              <p className="text-xs text-muted-foreground">{user.email}</p>
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

          <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return null;
}
