import { Button, buttonVariants } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { BrowserThemeSelector } from "@/components/browser-theme-selector";
import { HeaderLogo } from "./header-logo";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const LandingHeader: React.FC = () => (
  <header className="flex h-14 items-center justify-between p-4 bg-background-2 border-b">
    <div className="flex items-center gap-4">
      <HeaderLogo />
      <Separator orientation="vertical" className="h-4" />
      <SignedIn>
        <Link
          href="/generator"
          className={cn(
            buttonVariants({ variant: "link" }),
            "px-0 text-muted-foreground hover:text-foreground"
          )}
        >
          Editor
        </Link>
      </SignedIn>
      <Link
        href="/gallery"
        className={cn(
          buttonVariants({ variant: "link" }),
          "px-0 text-muted-foreground hover:text-foreground"
        )}
      >
        Gallery
      </Link>
      <a
        href="https://github.com/Railly/tinte"
        className={cn(
          buttonVariants({ variant: "link" }),
          "px-0 text-muted-foreground hover:text-foreground"
        )}
      >
        GitHub
      </a>
    </div>
    <div className="flex gap-4">
      <BrowserThemeSelector />
      <div className="flex items-center space-x-4">
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
  </header>
);
