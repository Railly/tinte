import "./globals.css";
import { Providers } from "@/components/providers";
import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import CounterscaleScript from "@/components/counterscale-script";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Tinte - VS Code Theme Generator",
  description:
    "Tinte is an opinionated VS Code Theme generator that helps you create stunning and consistent color themes for your IDE. With a wide range of preset colors and customization options, Tinte makes it easy to design beautiful VS Code themes.",
  keywords: [
    "shadcn's theme",
    "how to create vs code theme",
    "vs code theme generator",
    "vs code theme",
    "tinte",
    "one hunter theme",
    "vs code theme creator",
    "vs code theme generator",
  ],
  authors: [{ name: "Railly Hugo" }],
  openGraph: {
    title: "Tinte - VS Code Theme Generator",
    description:
      "Tinte is an opinionated VS Code Theme generator that helps you create stunning and consistent color themes for your IDE.",
    url: "https://tinte.railly.dev",
    siteName: "Tinte",
    images: [
      {
        url: "https://tinte.railly.dev/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en-US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tinte - VS Code Theme Generator",
    description:
      "Tinte is an opinionated VS Code Theme generator that helps you create stunning and consistent color themes for your IDE",
    creator: "@raillyhugo",
    images: ["https://tinte.railly.dev/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={cn(
          "font-sans antialiased bg-background text-foreground",
          GeistSans.variable,
          GeistMono.variable
        )}
        suppressHydrationWarning
      >
        <body className="min-h-screen relative">
          <Providers>
            {children}
            <Analytics />
            <CounterscaleScript />
            <Toaster position="top-right" richColors />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
