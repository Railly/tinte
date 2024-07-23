import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { formatTheme } from "@/app/utils";
import { ThemePageContent } from "@/components/theme-page-content";

interface ThemePageProps {
  params: {
    id: string;
  };
}

const prisma = new PrismaClient();

async function getThemeById(id: string) {
  const theme = await prisma.themes.findUnique({
    where: { xata_id: id },
    include: {
      ThemePalettes: true,
      TokenColors: true,
      Users: true,
    },
  });

  if (!theme) {
    notFound();
  }
  prisma.$disconnect();
  return formatTheme(theme);
}

export default async function ThemePage({ params }: ThemePageProps) {
  const theme = await getThemeById(params.id);

  return <ThemePageContent themeConfig={theme} />;
}
