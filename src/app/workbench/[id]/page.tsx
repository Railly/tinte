import type { Metadata } from "next";
import { WorkbenchMain } from "@/components/workbench/workbench-main";
import { auth } from "@/lib/auth";
import { UserThemeService } from "@/lib/services/user-theme.service";
import { headers } from "next/headers";

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

  // Fetch user session and themes server-side
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  const userThemes = session 
    ? await UserThemeService.getUserThemes(session.user.id, 8) 
    : [];

  return <WorkbenchMain chatId={id} defaultTab={defaultTab} userThemes={userThemes} />;
}
