"use client";

import { Menu, LogIn, LogOut, User } from "lucide-react";
import Link from "next/link";
import GithubIcon from "@/components/shared/icons/github";
import TwitterIcon from "@/components/shared/icons/twitter";
import Logo from "@/components/shared/logo";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function Header() {
  const { data: session } = authClient.useSession();
  console.log({ session })

  const navigation = [
    { name: "Features", href: "#features" },
    { name: "Roadmap", href: "#roadmap" },
    { name: "FAQ", href: "#faq" },
    { name: "Docs", href: "#docs" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4">
        <div className="relative flex h-[var(--header-height)] items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Logo size={24} />
            <span className="font-bold text-base">Tinte</span>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center gap-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </a>
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

            {session ? (
              <>
                <Button variant="ghost" size="sm" className="h-7 px-3 text-xs gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={session.user.image || ""} />
                    <AvatarFallback className="text-xs">
                      {(session.user.name || session.user.email || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {session.user.name || session.user.email}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-3 text-xs"
                  onClick={() => authClient.signOut()}
                >
                  <LogOut className="h-3 w-3 mr-1" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => authClient.signIn.social({ provider: "github" })}
              >
                <LogIn className="h-3 w-3 mr-1" />
                Sign In
              </Button>
            )}

            <Button size="sm" className="h-7 px-3 text-xs" asChild>
              <Link href="/workbench">Get Started</Link>
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
                      <a
                        href={item.href}
                        className="text-2xl font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {item.name}
                      </a>
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

                  {session ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col items-center gap-2">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={session.user.image || ""} />
                          <AvatarFallback className="text-lg">
                            {(session.user.name || session.user.email || "U").charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-center text-sm text-muted-foreground">
                          Welcome, {session.user.name || session.user.email}!
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="lg"
                        className="h-12 px-8 text-base w-full font-medium"
                        onClick={() => authClient.signOut()}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="lg"
                      className="h-12 px-8 text-base w-full font-medium"
                      onClick={() => authClient.signIn.social({ provider: "github" })}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  )}

                  <Link href="/workbench">
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-12 px-8 text-base w-full font-medium"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
