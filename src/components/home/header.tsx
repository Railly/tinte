"use client";

import { Menu, Github, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import GithubIcon from "@/components/shared/icons/github";
import TwitterIcon from "@/components/shared/icons/twitter";
import Logo from "@/components/shared/logo";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { UserDropdown } from "@/components/shared/user-dropdown";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (href.startsWith("#") && pathname !== "/") {
      e.preventDefault();
      router.push(`/${href}`);
    }
  };

  const handleGetStarted = async () => {
    try {
      // Check if user is already authenticated
      const session = await authClient.getSession();

      if (session.data?.user) {
        // User is authenticated, go directly to workbench
        router.push("/workbench");
      } else {
        // User is not authenticated, show dialog
        setShowAuthDialog(true);
      }
    } catch (error) {
      console.error("Error checking session:", error);
      // If there's an error, show the dialog anyway
      setShowAuthDialog(true);
    }
  };

  const handleContinueAsGuest = async () => {
    setIsLoading(true);
    try {
      // Sign in anonymously using better-auth
      await authClient.signIn.anonymous();
      toast.success("Welcome! You're now signed in as a guest.");
      router.push("/workbench");
    } catch (error) {
      console.error("Error signing in as guest:", error);
      toast.error("Failed to continue as guest. Please try again.");
    } finally {
      setIsLoading(false);
      setShowAuthDialog(false);
    }
  };

  const handleSignInWithGitHub = async () => {
    setIsLoading(true);
    try {
      // Sign in with GitHub using better-auth
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/workbench",
      });
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
      toast.error("Failed to sign in with GitHub. Please try again.");
      setIsLoading(false);
    }
  };

  const navigation = [
    { name: "Themes", href: "/themes" },
    { name: "Roadmap", href: "#roadmap" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4">
        <div className="relative flex h-[var(--header-height)] items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Logo size={24} />
            <span className="font-bold text-base">Tinte</span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center gap-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA + Social */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeSwitcher />
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon className="h-4 w-4" />
              </a>
            </Button>

            <UserDropdown avatarSize="sm" />

            <Button size="sm" className="h-7 px-3 text-xs" onClick={handleGetStarted}>
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden h-8 w-8 p-0"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 sm:w-96 p-8">
              <SheetHeader>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-full">
                <nav className="flex flex-col gap-8 pt-4">
                  {navigation.map((item) => (
                    <SheetClose key={item.name} asChild>
                      <Link
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className="text-2xl font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>

                <div className="mt-auto flex flex-col gap-6">
                  <div className="flex items-center justify-center gap-6">
                    <ThemeSwitcher />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-12 w-12 p-0"
                      asChild
                    >
                      <a
                        href={siteConfig.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <GithubIcon className="h-8 w-8" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-12 w-12 p-0"
                      asChild
                    >
                      <a
                        href={siteConfig.links.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <TwitterIcon className="h-8 w-8" />
                      </a>
                    </Button>
                  </div>

                  <div className="flex flex-col items-center">
                    <UserDropdown />
                  </div>

                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 text-base w-full font-medium"
                    onClick={handleGetStarted}
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Auth Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Get Started with Tinte</DialogTitle>
            <DialogDescription>
              Choose how you'd like to continue. You can always upgrade your account later.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-6">
            <Button
              onClick={handleContinueAsGuest}
              disabled={isLoading}
              variant="outline"
              className="w-full justify-start gap-3 h-12"
            >
              <UserPlus className="h-4 w-4" />
              Continue as Guest
            </Button>
            <Button
              onClick={handleSignInWithGitHub}
              disabled={isLoading}
              className="w-full justify-start gap-3 h-12"
            >
              <Github className="h-4 w-4" />
              Sign in with GitHub
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Guest accounts can create and save themes. Sign in to sync across devices and claim your themes.
          </p>
        </DialogContent>
      </Dialog>
    </header>
  );
}
