"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  User,
  UserX,
  Settings,
  LogOut,
  Link as LinkIcon,
  Save,
  Download,
  UserPlus,
} from "lucide-react";
import { useThemeContext } from "@/providers/theme";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import React from "react";

export function UserStatusIndicator() {
  const {
    user,
    isAuthenticated,
    isAnonymous,
    userThemes,
    saveCurrentTheme,
    syncAnonymousThemes,
    unsavedChanges,
    canSave,
  } = useThemeContext();

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success("Signed out successfully");
      window.location.reload(); // Refresh to clear state
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const handleLinkAccount = async () => {
    try {
      // Redirect to GitHub OAuth or show email signup
      window.location.href = "/api/auth/sign-in/github";
    } catch (error) {
      toast.error("Failed to link account");
    }
  };

  const handleSyncThemes = async () => {
    try {
      await syncAnonymousThemes();
      toast.success("Themes synced successfully!");
    } catch (error) {
      toast.error("Failed to sync themes");
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

  if (!isAuthenticated && !isAnonymous) {
    return (
      <Badge variant="outline" className="gap-1">
        <UserX className="w-3 h-3" />
        Guest
      </Badge>
    );
  }

  if (isAnonymous) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <Badge variant="secondary" className="gap-1">
              <UserPlus className="w-3 h-3" />
              Anonymous
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <div className="p-2">
            <p className="text-sm text-muted-foreground mb-2">
              You're signed in anonymously. Your themes are saved locally.
            </p>
            {userThemes.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {userThemes.length} theme{userThemes.length !== 1 ? 's' : ''} saved locally
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

          <DropdownMenuItem onClick={handleLinkAccount}>
            <LinkIcon className="w-4 h-4 mr-2" />
            Link to GitHub account
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

  if (isAuthenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <Badge variant="default" className="gap-1">
              <User className="w-3 h-3" />
              {user?.name || user?.email || 'User'}
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <div className="p-2">
            <p className="text-sm font-medium">
              {user?.name || 'User'}
            </p>
            {user?.email && (
              <p className="text-xs text-muted-foreground">
                {user.email}
              </p>
            )}
            {userThemes.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {userThemes.length} saved theme{userThemes.length !== 1 ? 's' : ''}
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