import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { BetaBanner } from "@/components/shared/layout/beta-banner";
import { TinteThemeScript } from "@/components/shared/theme/theme-script";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site";
import { PostHogProvider } from "@/providers/posthog";
import { QueryProvider } from "@/providers/query";
import { ThemeProvider } from "@/providers/theme";

export const metadata: Metadata = {
  description: siteConfig.longDescription,
  keywords: siteConfig.keywords,
  robots: {
    index: true,
    follow: true,
  },
};

export default function LegacyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PostHogProvider>
      <ClerkProvider>
        <NuqsAdapter>
          <QueryProvider>
            <ThemeProvider>
              {/* The workbench previews user-selectable Google Fonts, so it
                  loads the full family list and hides the body until
                  TinteThemeScript adds .fonts-loaded. Both are scoped to
                  legacy: the new home ships only Geist and must never be
                  gated behind that class. */}
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link
                rel="preconnect"
                href="https://fonts.gstatic.com"
                crossOrigin="anonymous"
              />
              <link
                href="https://fonts.googleapis.com/css2?family=Architects+Daughter&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Fira+Code:wght@300..700&family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400..700;1,400..700&family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Outfit:wght@100..900&family=Oxanium:wght@200..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100..900;1,100..900&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&family=Space+Grotesk:wght@300..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
                rel="stylesheet"
              />
              <TinteThemeScript />
              {children}
              <BetaBanner />
              <Toaster position="bottom-right" />
              <Analytics />
              <SpeedInsights />
              <Script
                defer
                src="https://counterscale.raillyhugo.workers.dev/tracker.js"
                data-site-id="tinte"
              />
            </ThemeProvider>
          </QueryProvider>
        </NuqsAdapter>
      </ClerkProvider>
    </PostHogProvider>
  );
}
