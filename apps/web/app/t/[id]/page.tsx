import { Metadata } from "next";
import { getThemeById } from "@/lib/api";
import { ThemeContent } from "./theme-content";

interface ThemePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: ThemePageProps): Promise<Metadata> {
  const theme = await getThemeById(params.id);

  if (!theme) {
    return {
      title: "Theme Not Found",
    };
  }

  const ogImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/og?id=${params.id}`;

  return {
    title: `${theme.displayName} - Tinte VS Code Theme`,
    description: `Explore the ${theme.displayName} theme for VS Code, created by ${theme.user?.username || "Anonymous"}. A ${theme.category} theme that enhances your coding experience.`,
    openGraph: {
      title: `${theme.displayName} - Tinte VS Code Theme`,
      description: `Explore the ${theme.displayName} theme for VS Code, created by ${theme.user?.username || "Anonymous"}. A ${theme.category} theme that enhances your coding experience.`,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/t/${params.id}`,
      siteName: "Tinte",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${theme.displayName} VS Code Theme`,
        },
      ],
      locale: "en-US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${theme.displayName} - Tinte VS Code Theme`,
      description: `Explore the ${theme.displayName} theme for VS Code, created by ${theme.user?.username || "Anonymous"}. A ${theme.category} theme that enhances your coding experience.`,
      images: [ogImageUrl],
      creator: "@raillyhugo",
    },
  };
}

export default async function ThemePage({ params }: ThemePageProps) {
  const theme = await getThemeById(params.id);

  return <ThemeContent themeConfig={theme} />;
}
