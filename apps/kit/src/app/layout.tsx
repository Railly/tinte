import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Kit by Tinte",
  description: "Generate a brand kit from a short brief.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
