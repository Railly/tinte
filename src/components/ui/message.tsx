"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface MessageContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Message({ children, className, ...props }: MessageProps) {
  return (
    <div className={cn("flex w-full", className)} {...props}>
      {children}
    </div>
  );
}

export function MessageContent({ children, className, ...props }: MessageContentProps) {
  return (
    <div className={cn("rounded-lg px-3 py-2", className)} {...props}>
      {children}
    </div>
  );
}