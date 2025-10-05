import type { Metadata } from "next";
import { headers } from "next/headers";
import { BrowseThemes } from "@/components/themes/browse-themes";
import { siteConfig } from "@/config/site";
import { auth } from "@/lib/auth";
import {
  getPublicThemes,
  getPublicThemesCount,
  getRaysoThemes,
  getTinteThemes,
  getTweakCNThemes,
  getUserFavoriteThemes,
  getUserThemes,
} from "@/lib/user-themes";

export const metadata: Metadata = {
  title: "Browse Community Themes",
  description:
    "Explore and discover beautiful themes created by the community. Browse themes for VS Code, shadcn/ui, terminals, and more. Get inspired by community creations and find the perfect theme for your workflow.",
  keywords: [
    ...siteConfig.keywords,
    "browse themes",
    "community themes",
    "theme gallery",
    "theme showcase",
    "user themes",
    "theme inspiration",
    "theme collection",
  ],
  alternates: {
    canonical: `${siteConfig.url}/themes`,
  },
  openGraph: {
    title: "Browse Community Themes | Tinte",
    description:
      "Explore and discover beautiful themes created by the community. Browse themes for VS Code, shadcn/ui, terminals, and more.",
    url: `${siteConfig.url}/themes`,
    type: "website",
    images: [
      {
        url: `${siteConfig.url}/og-themes.jpg`,
        width: 1200,
        height: 630,
        alt: "Browse community themes on Tinte - Theme gallery and showcase",
      },
    ],
  },
  twitter: {
    title: "Browse Community Themes | Tinte",
    description:
      "Explore beautiful themes created by the community. Find inspiration for your next theme.",
    images: [`${siteConfig.url}/og-themes.jpg`],
  },
  other: {
    "article:section": "Gallery",
    "article:tag": "themes,community,gallery,showcase",
  },
};

export default async function ThemesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category, search, from } = await searchParams;

  // Fetch user session and themes server-side
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userThemes = session
    ? await getUserThemes(session.user.id, undefined, session.user)
    : [];

  const favoriteThemes = session
    ? await getUserFavoriteThemes(session.user.id)
    : [];

  const publicThemes = await getPublicThemes(20);
  const publicThemesCount = await getPublicThemesCount();
  const tweakCNThemes = await getTweakCNThemes();
  const tinteThemes = await getTinteThemes();
  const raysoThemes = await getRaysoThemes();

  return (
    <BrowseThemes
      session={session}
      userThemes={userThemes}
      publicThemes={publicThemes}
      favoriteThemes={favoriteThemes}
      tweakCNThemes={tweakCNThemes}
      tinteThemes={tinteThemes}
      raysoThemes={raysoThemes}
      publicThemesCount={publicThemesCount}
      initialCategory={category as string}
      initialSearch={search as string}
      fromWorkbench={from === "workbench"}
    />
  );
}
