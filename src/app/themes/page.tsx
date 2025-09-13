import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { UserThemeService } from "@/lib/services/user-theme.service";
import { headers } from "next/headers";
import { BrowseThemes } from "@/components/themes/browse-themes";

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
    headers: await headers()
  });
  
  const userThemes = session 
    ? await UserThemeService.getUserThemes(session.user.id) 
    : [];
    
  const publicThemes = await UserThemeService.getPublicThemes();

  return (
    <BrowseThemes 
      session={session}
      userThemes={userThemes}
      publicThemes={publicThemes}
      initialCategory={category as string}
      initialSearch={search as string}
    />
  );
}