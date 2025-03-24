import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { Button, type ButtonProps } from "./button";

export const ShineButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        {...props}
        className={cn(
          "animate-bg-shine rounded-lg border-[1px] bg-[length:200%_100%] tracking-wide shadow",
          "dark:border-zinc-800 dark:bg-[linear-gradient(110deg,#09090B,45%,#27272A,55%,#09090B)] dark:text-zinc-200",
          "border-zinc-300 bg-[linear-gradient(110deg,#FFF,45%,#E4E4E7,55%,#FFF)] text-zinc-800",
          className,
        )}
      />
    );
  },
);

ShineButton.displayName = "ShineButton";
