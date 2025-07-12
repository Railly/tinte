import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

// Shared utility class segments to avoid redundancy across variants
const sharedBefore = [
  "before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-[inherit]",
  "before:bg-gradient-to-b before:p-px",
  "before:[mask-clip:content-box,border-box] before:[mask-composite:exclude] before:[mask-image:linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)]",
] as const;

const sharedAfter = [
  "after:absolute after:inset-0 after:rounded-[inherit]",
  "after:pointer-events-none after:opacity-15 after:transition after:duration-200 after:ease-out",
] as const;

const buttonVariants = cva(
  [
    // base
    "group relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium outline-none",
    "transition duration-200 ease-out",
    // focus
    "focus:outline-none",
    // disabled
    "disabled:pointer-events-none disabled:opacity-60",
    "disabled:shadow-none disabled:before:hidden disabled:after:hidden",
    // svg
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 [&_svg]:relative [&_svg]:z-10",
  ],
  {
    variants: {
      variant: {
        default: [
          // base colors using our primary golden system
          "bg-primary-base text-primary-foreground shadow-sm",
          ...sharedBefore,
          "before:from-white/20 before:to-transparent",
          ...sharedAfter,
          "after:bg-gradient-to-b after:from-white after:to-transparent",
          "disabled:bg-primary-inactive disabled:text-primary-foreground",
          "hover:after:opacity-25 hover:bg-primary-darker dark:hover:bg-primary-dark",
        ],
        secondary: [
          // secondary using our blue secondary system
          "bg-secondary-base text-secondary-foreground shadow-sm",
          ...sharedBefore,
          "before:from-white/20 before:to-transparent",
          ...sharedAfter,
          "after:bg-gradient-to-b after:from-white after:to-transparent",
          "disabled:bg-secondary-inactive disabled:text-secondary-foreground",
          "hover:after:opacity-25 hover:bg-secondary-darker dark:hover:bg-secondary-dark",
        ],
        destructive: [
          // destructive with fancy effects
          "bg-error-base text-error-foreground shadow-sm",
          ...sharedBefore,
          "before:from-white/20 before:to-transparent",
          ...sharedAfter,
          "after:bg-gradient-to-b after:from-white after:to-transparent",
          "disabled:bg-error-soft disabled:text-error-foreground",
          "hover:after:opacity-25 hover:bg-error-strong",
        ],
        neutral: [
          "bg-text-base text-ui-base shadow-sm",
          ...sharedBefore,
          "before:from-white/20 before:to-transparent",
          ...sharedAfter,
          "after:bg-gradient-to-b after:from-white after:to-transparent",
          "disabled:bg-text-inactive disabled:text-ui-base",
          "hover:after:opacity-30 hover:bg-text-strong dark:hover:bg-text-soft",
        ],
        outline: [
          // clean secondary using our background tokens
          "bg-ui-subtle text-text-base border border-border-base shadow-sm",
          "hover:bg-ui-soft hover:border-border-strong hover:text-text-strong",
          ...sharedBefore,
          "before:from-white/8 before:to-transparent",
          "disabled:bg-ui-inactive disabled:text-text-inactive disabled:border-border-inactive",
        ],
        "outline-secondary": [
          "border border-secondary-base text-secondary-base bg-transparent shadow-sm",
          "hover:bg-secondary-subtle hover:text-secondary-darker hover:border-secondary-darker transition-all duration-200",
          "disabled:border-secondary-base/40 disabled:text-secondary-base/40 disabled:bg-transparent",
          ...sharedBefore,
          "before:from-secondary-base/30 before:to-transparent",
        ],
        "outline-destructive": [
          "border border-error-base text-error-base bg-transparent shadow-sm",
          "hover:bg-error-subtle hover:text-error-strong hover:border-error-strong transition-all duration-200",
          "disabled:border-error-base/40 disabled:text-error-base/40 disabled:bg-transparent",
          ...sharedBefore,
          "before:from-error-base/30 before:to-transparent",
        ],
        "outline-success": [
          "border border-success-base text-success-base bg-transparent shadow-sm",
          "hover:bg-success-subtle hover:text-success-strong hover:border-success-strong transition-all duration-200",
          "disabled:border-success-base/40 disabled:text-success-base/40 disabled:bg-transparent",
          ...sharedBefore,
          "before:from-success-base/30 before:to-transparent",
        ],
        "outline-warning": [
          "border border-warning-base text-warning-base bg-transparent shadow-sm",
          "hover:bg-warning-subtle hover:text-warning-strong hover:border-warning-strong transition-all duration-200",
          "disabled:border-warning-base/40 disabled:text-warning-base/40 disabled:bg-transparent",
          ...sharedBefore,
          "before:from-warning-base/30 before:to-transparent",
        ],
        "outline-info": [
          "border border-info-base text-info-base bg-transparent shadow-sm",
          "hover:bg-info-subtle hover:text-info-strong hover:border-info-strong transition-all duration-200",
          "disabled:border-info-base/40 disabled:text-info-base/40 disabled:bg-transparent",
          ...sharedBefore,
          "before:from-info-base/30 before:to-transparent",
        ],
        "outline-neutral": [
          "border border-text-base text-text-base bg-transparent shadow-sm",
          "hover:bg-ui-soft hover:border-text-strong transition-all duration-200",
          "disabled:border-text-base/40 disabled:text-text-base/40 disabled:bg-transparent",
          ...sharedBefore,
          "before:from-text-base/15 before:to-transparent",
        ],
        ghost: [
          // minimal ghost variant
          "text-text-base hover:bg-ui-soft hover:text-text-strong",
          "disabled:bg-transparent disabled:text-text-inactive",
          "transition-all duration-200",
        ],
        link: [
          // link style with primary accent
          "text-primary-base underline-offset-4 hover:underline hover:text-primary-darker",
          "disabled:text-primary-inactive disabled:no-underline",
          "transition-all duration-200",
        ],
        success: [
          // success with fancy effects
          "bg-success-base text-success-foreground shadow-sm",
          ...sharedBefore,
          "before:from-white/20 before:to-transparent",
          ...sharedAfter,
          "after:bg-gradient-to-b after:from-white after:to-transparent",
          "disabled:bg-success-soft disabled:text-success-foreground",
          "hover:after:opacity-25 hover:bg-success-strong",
        ],
        warning: [
          // warning with fancy effects
          "bg-warning-base text-warning-foreground shadow-sm",
          ...sharedBefore,
          "before:from-white/20 before:to-transparent",
          ...sharedAfter,
          "after:bg-gradient-to-b after:from-white after:to-transparent",
          "disabled:bg-warning-soft disabled:text-warning-foreground",
          "hover:after:opacity-25 hover:bg-warning-strong",
        ],
        info: [
          // info with fancy effects
          "bg-info-base text-info-foreground shadow-sm",
          ...sharedBefore,
          "before:from-white/20 before:to-transparent",
          ...sharedAfter,
          "after:bg-gradient-to-b after:from-white after:to-transparent",
          "disabled:bg-info-soft disabled:text-info-foreground",
          "hover:after:opacity-25 hover:bg-info-strong",
        ],
      },
      size: {
        xs: "h-8 px-2.5 gap-2 rounded-lg text-xs",
        sm: "h-9 px-3 gap-2 rounded-lg text-sm",
        default: "h-10 px-3.5 gap-3 rounded-xl text-sm",
        lg: "h-12 px-6 gap-3 rounded-xl text-base",
        xl: "h-14 px-8 gap-4 rounded-2xl text-lg",
        icon: "size-10 rounded-xl",
        "icon-sm": "size-9 rounded-lg",
        "icon-xs": "size-8 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
