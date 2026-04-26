import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kit by Tinte — multi-model brand kit generator",
  description:
    "Logo, variations, moodboard, and bento composition. Each piece routed to the model that does it best — Recraft V4, Flux 1.1 Pro Ultra, GPT Image 2.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
        lang="en"
      >
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
