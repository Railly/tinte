import { Fork } from "./fork";
import { GenerateTheme } from "./generate-theme";
import { Hero } from "./hero";
import { ThemeEditor } from "./theme-editor";
import { ThemePreview } from "./theme-preview";
import { ThemeSelector } from "./theme-selector";

export default function ShadcnPage() {
  return (
    <>
      <Hero />
      <main className="container mx-auto flex flex-grow flex-col">
        <div className="my-8 flex flex-col gap-4">
          <div className="mx-auto md:w-1/2">
            <div className="text-center text-muted-foreground text-sm">
              Create your own theme with AI
            </div>
            <GenerateTheme />
          </div>
          <div className="text-center text-muted-foreground text-sm">Or</div>
          <div className="mx-auto">
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
    </>
  );
}
