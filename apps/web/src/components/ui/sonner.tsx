"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "var(--primary)",
          "--success-text": "var(--primary-foreground)",
          "--success-border": "var(--sidebar-ring)",
          "--error-bg": "var(--destructive)",
          "--error-text": "var(--destructive-foreground)",
          "--error-border": "var(--destructive)",
          "--warning-bg": "var(--accent)",
          "--warning-text": "var(--accent-foreground)",
          "--warning-border": "var(--sidebar-accent)",
          "--info-bg": "var(--card)",
          "--info-text": "var(--card-foreground)",
          "--info-border": "var(--sidebar-border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
