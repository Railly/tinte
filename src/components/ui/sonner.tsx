"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";
import { useThemeContext } from "@/providers/theme";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useThemeContext();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
