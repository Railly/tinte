import { getThemeById } from "@/lib/api";
import { ThemeContent } from "./theme-content";

interface ThemePageProps {
  params: {
    id: string;
  };
}

export default async function ThemePage({ params }: ThemePageProps) {
  const theme = await getThemeById(params.id);

  return <ThemeContent themeConfig={theme} />;
}
