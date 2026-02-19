import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Beautiful Code Screenshots | Ray by Tinte",
  description:
    "Create and share beautiful code screenshots with 500+ themes. Free API, Claude Code skill, and 16 languages. The open-source alternative to Carbon and Ray.so.",
  applicationName: "Ray",
  keywords: [
    "code screenshot",
    "code screenshot tool",
    "code to image",
    "beautiful code screenshots",
    "code snippet image",
    "code image generator",
    "code screenshot API",
    "carbon alternative",
    "ray.so alternative",
    "syntax highlighting",
    "code sharing",
    "tinte themes",
    "developer tools",
    "programmatic code screenshots",
  ],
  metadataBase: new URL("https://ray.tinte.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Create Beautiful Code Screenshots | Ray by Tinte",
    description:
      "Create and share beautiful code screenshots with 500+ themes. Free API, Claude Code skill, and 16 languages.",
    url: "https://ray.tinte.dev",
    siteName: "Ray by Tinte",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@raillyhugo",
    title: "Create Beautiful Code Screenshots | Ray by Tinte",
    description:
      "500+ themes, free API, Claude Code skill. The open-source Carbon & Ray.so alternative.",
  },
  other: {
    "theme-color": "#09090b",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
