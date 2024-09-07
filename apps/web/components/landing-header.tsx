"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { BrowserThemeSelector } from "@/components/browser-theme-selector";
import { HeaderLogo } from "./header-logo";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AchievementBanner } from "./achievement-banner";
import { useState } from "react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { motion, AnimatePresence } from "framer-motion";

export const LandingHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <AchievementBanner />
      <header className="bg-background-2 border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center">
              <HeaderLogo />
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <SignedIn>
                    <Link
                      href="/generator"
                      className={cn(
                        buttonVariants({ variant: "link" }),
                        "px-0 text-muted-foreground hover:text-foreground",
                      )}
                    >
                      Editor
                    </Link>
                  </SignedIn>
                  <SignedOut>
                    <Link
                      href="/gallery"
                      className={cn(
                        buttonVariants({ variant: "link" }),
                        "px-0 text-muted-foreground hover:text-foreground",
                      )}
                    >
                      Gallery
                    </Link>
                  </SignedOut>
                  <a
                    href="https://github.com/Railly/tinte"
                    className={cn(
                      buttonVariants({ variant: "link" }),
                      "px-0 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <BrowserThemeSelector />
                <div className="ml-3">
                  <SignedOut>
                    <SignInButton mode="modal" forceRedirectUrl="/generator">
                      <Button variant="default">Log in</Button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </div>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                <HamburgerMenuIcon
                  className="block h-6 w-6"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <SignedIn>
                  <Link
                    href="/generator"
                    className={cn(
                      buttonVariants({ variant: "link" }),
                      "block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-gray-700",
                    )}
                  >
                    Editor
                  </Link>
                </SignedIn>
                <SignedOut>
                  <Link
                    href="/gallery"
                    className={cn(
                      buttonVariants({ variant: "link" }),
                      "block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-gray-700",
                    )}
                  >
                    Gallery
                  </Link>
                </SignedOut>
                <a
                  href="https://github.com/Railly/tinte"
                  className={cn(
                    buttonVariants({ variant: "link" }),
                    "block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-gray-700",
                  )}
                >
                  GitHub
                </a>
              </div>
              <div className="pt-4 pb-3 border-t">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <BrowserThemeSelector />
                  </div>
                  <div className="ml-3">
                    <SignedOut>
                      <SignInButton mode="modal" forceRedirectUrl="/generator">
                        <Button variant="default">Log in</Button>
                      </SignInButton>
                    </SignedOut>
                    <SignedIn>
                      <UserButton />
                    </SignedIn>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
