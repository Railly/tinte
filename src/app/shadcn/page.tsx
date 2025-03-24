import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { SignedIn } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { SignedOut } from "@clerk/nextjs";
import { Fork } from "./fork";
import { GenerateTheme } from "./generate-theme";
import { ThemeEditor } from "./theme-editor";
import { ThemePreview } from "./theme-preview";
import { ThemeSelector } from "./theme-selector";

export default function ShadcnPage() {
  return (
    <div>
      <main className="flex flex-grow flex-col">
        <div className="flex items-center justify-between">
          <span>HEADER</span>
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
        <div className="container mx-auto flex flex-col gap-4">
          <GenerateTheme />
          <div className="text-center text-muted-foreground text-sm">Or</div>
          <div className="flex w-full flex-col items-center justify-center space-y-6 p-6">
            <div className="text-center text-muted-foreground text-sm">
              Try themes from the community
            </div>
            <ThemeSelector />
          </div>
        </div>

        <ThemePreview />
      </main>

      <div className="-translate-x-1/2 fixed bottom-4 left-1/2 z-50 mx-auto flex gap-2">
        <ThemeEditor />
        <Fork />
      </div>
    </div>
  );
}
