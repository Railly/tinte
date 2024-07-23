import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { formatTheme } from "@/app/utils";
import { ThemePageContent } from "@/components/theme-page-content";
import { auth } from "@clerk/nextjs/server";

interface ThemePageProps {
  params: {
    id: string;
  };
}

const prisma = new PrismaClient();

async function getThemeById(id: string) {
  const { userId } = auth();

  const theme = await prisma.themes.findUnique({
    where: { xata_id: id },
    include: {
      ThemePalettes: true,
      TokenColors: true,
      Users: true,
    },
  });

  if (!theme || (!theme.is_public && theme.User !== userId)) {
    notFound();
  }

  prisma.$disconnect();
  return formatTheme(theme);
}

export default async function ThemePage({ params }: ThemePageProps) {
  const theme = await getThemeById(params.id);

  return <ThemePageContent themeConfig={theme} />;
}
