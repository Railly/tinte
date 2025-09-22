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

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Theme Workbench - Create & Edit Themes",
  description: "Create, edit, and convert themes with Tinte's powerful workbench. Live preview, real-time editing, and export to multiple formats including VS Code, shadcn/ui, terminals, and more.",
  keywords: [
    ...siteConfig.keywords,
    "theme workbench",
    "theme editor",
    "live preview",
    "real-time editing",
    "theme creation",
    "color editing",
    "theme conversion",
    "OKLCH editor",
  ],
  alternates: {
    canonical: `${siteConfig.url}/workbench`,
  },
  openGraph: {
    title: "Theme Workbench - Create & Edit Themes | Tinte",
    description: "Create, edit, and convert themes with live preview and real-time editing. Export to VS Code, shadcn/ui, terminals, and more.",
    url: `${siteConfig.url}/workbench`,
    type: "website",
    images: [
      {
        url: `${siteConfig.url}/og-workbench.jpg`,
        width: 1200,
        height: 630,
        alt: "Tinte Theme Workbench - Create and edit themes with live preview",
      },
    ],
  },
  twitter: {
    title: "Theme Workbench - Create & Edit Themes | Tinte",
    description: "Create beautiful themes with live preview and real-time editing. Export to multiple formats.",
    images: [`${siteConfig.url}/og-workbench.jpg`],
  },
  other: {
    "article:section": "Tools",
    "article:tag": "workbench,editor,themes,tools,creation",
  },
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
