import { getThemeById } from "@/lib/api";
import { ThemePageContent } from "@/components/theme-page-content";

interface ThemePageProps {
  params: {
    id: string;
  };
}

export default async function ThemePage({ params }: ThemePageProps) {
  const theme = await getThemeById(params.id);

  return <ThemePageContent themeConfig={theme} />;
}
