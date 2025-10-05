import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { WorkbenchMain } from "@/components/workbench/workbench-main";
import { siteConfig } from "@/config/site";
import { auth } from "@/lib/auth";
import { getThemeBySlug } from "@/lib/get-theme-by-slug";
import {
  getRaysoThemes,
  getThemesWithUsers,
  getTinteThemes,
  getTweakCNThemes,
} from "@/lib/user-themes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  const currentUserId = session?.user?.id;

  const [userThemes, tweakCNThemes, tinteThemes, raysoThemes] =
    await Promise.all([
      getThemesWithUsers(20, currentUserId),
      getTweakCNThemes(),
      getTinteThemes(),
      getRaysoThemes(),
    ]);

  const allThemes = [
    ...userThemes,
    ...tweakCNThemes,
    ...tinteThemes,
    ...raysoThemes,
  ];
  const theme = await getThemeBySlug(slug, allThemes);

  if (theme) {
    const themeName = theme.name;
    const themeDescription =
      theme.concept ||
      theme.description ||
      `Edit and customize the ${themeName} theme`;

    return {
      title: `${themeName} - Theme Editor | Tinte`,
      description: themeDescription,
      keywords: [
        ...siteConfig.keywords,
        themeName,
        "theme editor",
        "live preview",
        "theme customization",
      ],
      alternates: {
        canonical: `${siteConfig.url}/workbench/${slug}`,
      },
      openGraph: {
        title: `${themeName} - Theme Editor | Tinte`,
        description: themeDescription,
        url: `${siteConfig.url}/workbench/${slug}`,
        type: "website",
      },
      twitter: {
        title: `${themeName} - Theme Editor | Tinte`,
        description: themeDescription,
      },
    };
  }

  return {
    title: "Theme Workbench - Create & Edit Themes",
    description:
      "Create, edit, and convert themes with Tinte's powerful workbench. Live preview, real-time editing, and export to multiple formats including VS Code, shadcn/ui, terminals, and more.",
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
      description:
        "Create, edit, and convert themes with live preview and real-time editing. Export to VS Code, shadcn/ui, terminals, and more.",
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
      description:
        "Create beautiful themes with live preview and real-time editing. Export to multiple formats.",
      images: [`${siteConfig.url}/og-workbench.jpg`],
    },
    other: {
      "article:section": "Tools",
      "article:tag": "workbench,editor,themes,tools,creation",
    },
  };
}

export default async function WorkbenchSlugPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const { tab, prompt } = await searchParams;

  const defaultTab = prompt
    ? "agent"
    : (tab as "canonical" | "overrides" | "agent") || "agent";

  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  const currentUserId = session?.user?.id;

  // Fetch themes in parallel
  const [userThemes, tweakCNThemes, tinteThemes, raysoThemes] =
    await Promise.all([
      getThemesWithUsers(20, currentUserId),
      getTweakCNThemes(),
      getTinteThemes(),
      getRaysoThemes(),
    ]);

  // Try to get the theme by slug (server-side)
  const allThemes = [
    ...userThemes,
    ...tweakCNThemes,
    ...tinteThemes,
    ...raysoThemes,
  ];
  const initialTheme = await getThemeBySlug(slug, allThemes);

  // No more redirects - workbench can handle any slug, with or without theme

  return (
    <WorkbenchMain
      themeSlug={slug}
      defaultTab={defaultTab}
      initialTheme={initialTheme}
      userThemes={userThemes}
      tweakCNThemes={tweakCNThemes}
      tinteThemes={tinteThemes}
      raysoThemes={raysoThemes}
      initialPrompt={prompt as string}
    />
  );
}
