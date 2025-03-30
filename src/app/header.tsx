import { Button, buttonVariants } from "@/components/ui/button";
import { IconRH, IconTinte } from "@/components/ui/icons";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ModeSelector } from "./mode-selector";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
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
          <div className="flex items-center gap-2 ml-2">
            <Separator orientation="vertical" className="h-4" />
            <Link
              href="/shadcn"
              className={cn(
                buttonVariants({ variant: "link", size: "sm" }),
                "text-muted-foreground"
              )}
            >
              Shadcn UI
            </Link>
            <Link
              href="/code"
              className={cn(
                buttonVariants({ variant: "link", size: "sm" }),
                "text-muted-foreground"
              )}
            >
              VS Code
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
          <a
            href="https://github.com/Railly/tinte"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
          >
            <GitHubLogoIcon className="size-4" />
          </a>
          <ModeSelector />
        </div>
      </header>
    </div>
  );
}
