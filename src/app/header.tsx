import { Button } from "@/components/ui/button";
import { IconRH, IconTinte } from "@/components/ui/icons";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ModeSelector } from "./mode-selector";

export function Header() {
  return (
    <div className="border-border border-b">
      <header className="container mx-auto flex h-12 items-center justify-between">
        <div className="flex items-center gap-2">
          <a
            href="https://railly.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconRH className="size-6" />
          </a>
          <span className="font-thin text-muted-foreground text-xl">/</span>
          <Link href="/" className="flex items-center gap-1">
            <IconTinte className="size-6" />
            <span className="font-bold text-muted-foreground">tinte</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ModeSelector />
          <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl="/shadcn">
              <Button size="sm" variant="default">
                Log in
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>
    </div>
  );
}
