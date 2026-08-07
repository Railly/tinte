import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { WorkbenchMain } from "@/components/workbench";
import { siteConfig } from "@/config/site";
import {
  getRaysoThemes,
  getThemeBySlug,
  getThemesWithUsers,
  getTinteThemes,
  getTweakCNThemes,
} from "@/lib/theme-operations";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const { userId: currentUserId } = await auth();

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
  const theme = await getThemeBySlug(slug, allThemes, currentUserId);

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
    title: "Design System Studio - Create & Edit Presets",
    description:
      "Create, edit, and compile design system presets with Tinte's studio. Live preview, OKLCH color editing, and export to 19+ formats including shadcn/ui, VS Code, and terminals.",
    keywords: [
      ...siteConfig.keywords,
      "design system studio",
      "preset editor",
      "live preview",
      "real-time editing",
      "preset creation",
      "OKLCH editor",
      "design system compiler",
    ],
    alternates: {
      canonical: `${siteConfig.url}/workbench`,
    },
    openGraph: {
      title: "Design System Studio - Create & Edit Presets | Tinte",
      description:
        "Create and compile design system presets with live preview and OKLCH editing. Export to 19+ formats including shadcn/ui, VS Code, and terminals.",
      url: `${siteConfig.url}/workbench`,
      type: "website",
      images: [
        {
          url: `${siteConfig.url}/og-workbench.jpg`,
          width: 1200,
          height: 630,
          alt: "Tinte Design System Studio - Create and edit presets with live preview",
        },
      ],
    },
    twitter: {
      title: "Design System Studio - Create & Edit Presets | Tinte",
      description:
        "Create design system presets with live preview and OKLCH editing. Export to 19+ formats.",
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

  const { userId: currentUserId } = await auth();

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
  const initialTheme = await getThemeBySlug(slug, allThemes, currentUserId);

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
