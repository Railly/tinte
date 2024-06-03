import "./globals.css";
import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

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
  themeColor: "#000000",
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
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body
        className={cn(
          "font-sans antialiased",
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
