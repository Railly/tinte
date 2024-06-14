import {
  ResponsiveModal,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { Button, buttonVariants } from "@/components/ui/button";
import { IconHeart, IconInfo } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export const HelpModal = () => {
  return (
    <ResponsiveModal
      trigger={
        <Button variant="outline">
          <IconInfo className="mr-2" />
          <span>How to Install</span>
        </Button>
      }
    >
      <ResponsiveModalHeader>
        <ResponsiveModalTitle>How to Set Theme in VSCode</ResponsiveModalTitle>
      </ResponsiveModalHeader>
      <ResponsiveModalDescription className="prose dark:prose-invert prose-neutral text-foreground leading-5">
        <ol className="flex flex-col gap-2">
          <li>Export your favorite theme using the "Export Theme" button.</li>
          <li>
            Open the VS Code command palette
            <ul className="mb-0">
              <li className="mb-0">
                <kbd>Ctrl+Shift+P</kbd> (Windows/Linux) or{" "}
                <kbd>Cmd+Shift+P</kbd> (Mac).
              </li>
            </ul>
          </li>
          <li>
            Type "VSIX" and select <b>"Extensions: Install from VSIX"</b>.
          </li>
          <li>Choose the exported theme file and let VSCode install it.</li>
          <li>
            Activate your theme
            <ul className="mb-0">
              <li>Go to Extensions view</li>
              <li>Find your new theme</li>
              <li className="mb-0">Click "Set Color Theme"</li>
            </ul>
          </li>
        </ol>
        <p className="mt-4 mb-8">Enjoy your personalized VSCode experience!</p>
        <div className="flex gap-2 w-full">
          <a
            className={cn(
              buttonVariants({ variant: "default" }),
              "flex w-full items-center gap-2 no-underline"
            )}
            href="https://donate.railly.dev"
            target="_blank"
          >
            <IconHeart />
            Support me
          </a>
          <a
            href="https://www.railly.dev"
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex w-full items-center gap-2 no-underline"
            )}
          >
            Know more about me
          </a>
        </div>
      </ResponsiveModalDescription>
    </ResponsiveModal>
  );
};
