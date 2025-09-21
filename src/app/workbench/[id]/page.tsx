import type { Metadata } from "next";
import { headers } from "next/headers";
import { WorkbenchMain } from "@/components/workbench/workbench-main";
import { UserThemeService } from "@/lib/services/user-theme.service";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Theme Workbench | Tinte",
  description:
    "Create, edit, and convert themes with Tinte's powerful workbench",
};

export default async function WorkbenchIdPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;

  const defaultTab =
    (tab as "canonical" | "overrides" | "agent") || "canonical";

  // Get current user session
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  const currentUserId = session?.user?.id;

  // Fetch themes with user data server-side, including favorite status
  const userThemes = await UserThemeService.getThemesWithUsers(20, currentUserId);
  const tweakCNThemes = await UserThemeService.getTweakCNThemes();
  const tinteThemes = await UserThemeService.getTinteThemes();
  const raysoThemes = await UserThemeService.getRaysoThemes();

  return <WorkbenchMain chatId={id} defaultTab={defaultTab} userThemes={userThemes} tweakCNThemes={tweakCNThemes} tinteThemes={tinteThemes} raysoThemes={raysoThemes} />;
}
