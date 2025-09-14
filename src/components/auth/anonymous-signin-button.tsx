"use client";

import { Button } from "@/components/ui/button";
import { UserPlus, Loader2 } from "lucide-react";
import { useThemeContext } from "@/providers/theme";
import { toast } from "sonner";
import React from "react";

interface AnonymousSignInButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
  children?: React.ReactNode;
}

export function AnonymousSignInButton({
  variant = "default",
  size = "default",
  className,
  children,
}: AnonymousSignInButtonProps) {
  const { signInAnonymously, isAuthenticated, isAnonymous } = useThemeContext();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignIn = async () => {
    if (isAuthenticated && !isAnonymous) {
      toast.info("You're already signed in!");
      return;
    }

    if (isAnonymous) {
      toast.info("You're already using anonymous mode!");
      return;
    }

    setIsLoading(true);
    try {
      await signInAnonymously();
      toast.success("Signed in anonymously! You can now save themes.");
    } catch (error) {
      console.error("Error signing in anonymously:", error);
      toast.error("Failed to sign in anonymously");
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return null; // Don't show the button if user is already authenticated
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleSignIn}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : (
        <UserPlus className="w-4 h-4 mr-2" />
      )}
      {children || (isLoading ? "Signing in..." : "Sign in to save themes")}
    </Button>
  );
}