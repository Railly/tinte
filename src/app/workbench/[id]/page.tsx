import type { Metadata } from "next";
import { WorkbenchMain } from "@/components/workbench/workbench-main";

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

  const defaultTab = (tab as "canonical" | "overrides" | "agent") || "canonical";

  return <WorkbenchMain chatId={id} defaultTab={defaultTab} />;
}
