import type { Metadata } from "next";
import { headers } from "next/headers";
import { WorkbenchMain } from "@/components/workbench/workbench-main";
import { auth } from "@/lib/auth";
import {
  getRaysoThemes,
  getThemesWithUsers,
  getTinteThemes,
  getTweakCNThemes,
} from "@/lib/user-themes";

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

  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  const currentUserId = session?.user?.id;

  const userThemes = await getThemesWithUsers(20, currentUserId);
  const tweakCNThemes = await getTweakCNThemes();
  const tinteThemes = await getTinteThemes();
  const raysoThemes = await getRaysoThemes();

  return (
    <WorkbenchMain
      chatId={id}
      defaultTab={defaultTab}
      userThemes={userThemes}
      tweakCNThemes={tweakCNThemes}
      tinteThemes={tinteThemes}
      raysoThemes={raysoThemes}
    />
  );
}
