import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { ElementsBanner } from "@/components/home/elements-banner";
import { FAQ } from "@/components/home/faq";
import { Header } from "@/components/home/header";
import { Hero } from "@/components/home/hero";
import { Roadmap } from "@/components/home/roadmap";
import { Showcase } from "@/components/home/showcase";
import { Footer } from "@/components/shared/layout";
import { siteConfig } from "@/config/site";
import { generateOrganizationSchema, generatePageSchema } from "@/lib/seo";
import {
  getPublicThemes,
  getRaysoThemes,
  getTinteThemes,
  getTweakCNThemes,
  getUserFavoriteThemes,
  getUserThemes,
} from "@/lib/theme-operations";

export const metadata: Metadata = {
  title: "Multi-Platform Theme Generator & Converter",
  description: siteConfig.longDescription,
  keywords: siteConfig.keywords,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: `${siteConfig.name} - Multi-Platform Theme Generator & Converter`,
    description: siteConfig.longDescription,
    url: siteConfig.url,
    type: "website",
    // Images are handled by /app/opengraph-image.tsx
  },
  twitter: {
    title: `${siteConfig.name} - Multi-Platform Theme Generator`,
    description: siteConfig.longDescription,
    // Images are handled by /app/opengraph-image.tsx
  },
  other: {
    "article:section": "Technology",
    "article:tag": siteConfig.keywords.slice(0, 10).join(","),
  },
};

export default async function Home() {
  const { userId } = await auth();

  const [
    userThemes,
    favoriteThemes,
    publicThemes,
    tweakCNThemes,
    tinteThemes,
    raysoThemes,
  ] = await Promise.all([
    userId ? getUserThemes(userId, 8, { id: userId }) : Promise.resolve([]),
    userId ? getUserFavoriteThemes(userId) : Promise.resolve([]),
    getPublicThemes(8),
    getTweakCNThemes(8),
    getTinteThemes(8),
    getRaysoThemes(8),
  ]);

  const pageSchema = generatePageSchema({
    title: "Multi-Platform Theme Generator & Converter",
    description: siteConfig.longDescription,
    url: siteConfig.url,
    type: "WebApplication",
  });

  const organizationSchema = generateOrganizationSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <div className="min-h-screen">
        <Header />
        <ElementsBanner />
        <Hero
          userThemes={userThemes}
          tweakCNThemes={tweakCNThemes}
          tinteThemes={tinteThemes}
          raysoThemes={raysoThemes}
        />
        <Showcase
          session={userId ? { user: { id: userId } } : null}
          userThemes={userThemes}
          publicThemes={publicThemes}
          favoriteThemes={favoriteThemes}
          tweakCNThemes={tweakCNThemes}
          tinteThemes={tinteThemes}
          raysoThemes={raysoThemes}
        />
        <Roadmap />
        <FAQ />
        <Footer />
      </div>
    </>
  );
}
