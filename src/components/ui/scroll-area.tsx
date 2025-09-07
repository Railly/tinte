"use client";

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { motion, useScroll, useTransform } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

interface ScrollIndicatorProps {
  showScrollIndicators?: boolean;
  indicatorType?: "shadow" | "mask" | "border";
}

function ScrollArea({
  className,
  children,
  showScrollIndicators = false,
  indicatorType = "shadow",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root> &
  ScrollIndicatorProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });

  // Top indicator: invisible at start (0), visible when scrolling (0.1+) - more subtle
  const topOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 0.6]);

  // Bottom indicator: visible at start (1), invisible near end (0.9+) - more subtle
  const bottomOpacity = useTransform(scrollYProgress, [0.85, 1], [0.6, 0]);

  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      {showScrollIndicators && (
        <>
          <motion.div
            className={cn(
              "absolute top-0 left-0 right-0 h-4 z-50 pointer-events-none",
              indicatorType === "shadow" &&
              "bg-gradient-to-b from-background via-background/40 to-transparent shadow-sm",
              indicatorType === "border" &&
              "bg-gradient-to-b from-background/60 to-transparent border-b border-border/20",
              indicatorType === "mask" &&
              "bg-gradient-to-b from-background/70 to-transparent",
            )}
            style={{ opacity: topOpacity }}
          />
          <motion.div
            className={cn(
              "absolute bottom-0 left-0 right-0 h-4 z-50 pointer-events-none",
              indicatorType === "shadow" &&
              "bg-gradient-to-t from-background via-background/40 to-transparent shadow-sm",
              indicatorType === "border" &&
              "bg-gradient-to-t from-background/60 to-transparent border-t border-border/20",
              indicatorType === "mask" &&
              "bg-gradient-to-t from-background/70 to-transparent",
            )}
            style={{ opacity: bottomOpacity }}
          />
        </>
      )}
      <ScrollAreaPrimitive.Viewport
        ref={scrollRef}
        data-slot="scroll-area-viewport"
        className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="bg-border relative flex-1 rounded-full"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };
