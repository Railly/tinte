import type { Metadata } from "next";
import { headers } from "next/headers";
import { BrowseThemes } from "@/components/themes/browse-themes";
import { auth } from "@/lib/auth";
import { getUserThemes, getUserFavoriteThemes, getPublicThemes, getPublicThemesCount, getTweakCNThemes, getTinteThemes, getRaysoThemes } from "@/lib/user-themes";

export const metadata: Metadata = {
  title: "Browse Themes | Tinte",
  description: "Explore and discover beautiful themes created by the community",
};

export default async function ThemesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category, search } = await searchParams;

  // Fetch user session and themes server-side
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userThemes = session
    ? await getUserThemes(
        session.user.id,
        undefined,
        session.user,
      )
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
    />
  );
}
