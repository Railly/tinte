import {
  IconTinte,
  IconGithub,
  IconRH,
  IconHeart,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { ThemeSelector } from "@/components/theme-selector";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { buttonVariants } from "./ui/button";
import { SubscriptionForm } from "./subscription-form";

export const Header = () => {
  return (
    <header className="flex items-center justify-between gap-4 py-2 px-8 border-b">
      <div className="flex items-center gap-2">
        <IconTinte />
        <h1 className="text-md font-bold">tinte</h1>
      </div>
      <div className="flex items-center gap-2">
        <SubscriptionForm />
        <TooltipProvider>
          <ThemeSelector />
          {/* Donate Button Just a IconHeart */}
          <Tooltip>
            <TooltipTrigger>
              <a
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "flex items-center gap-2"
                )}
                href="https://donate.railly.dev"
                target="_blank"
              >
                <IconHeart />
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-xs">Support</span>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <a
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "flex items-center gap-2"
                )}
                href="https://github.com/Railly/tinte"
                target="_blank"
              >
                <IconGithub className="text-foreground" />
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-xs">Github</span>
            </TooltipContent>
          </Tooltip>
          {/* <Tooltip>
            <TooltipTrigger>
              <a
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "flex items-center gap-2"
                )}
                href="https://www.railly.dev"
                target="_blank"
              >
                <IconRH />
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-xs">Railly's Blog</span>
            </TooltipContent>
          </Tooltip> */}
        </TooltipProvider>
      </div>
    </header>
  );
};
