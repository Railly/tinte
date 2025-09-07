import type { Metadata } from "next";
import { WorkbenchMain } from "@/components/workbench/workbench-main";

export const metadata: Metadata = {
  title: "Theme Workbench | Tinte",
  description:
    "Create, edit, and convert themes with Tinte's powerful workbench",
};

export default async function WorkbenchIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const defaultTab = "colors";

  return (
    <WorkbenchMain chatId={id} defaultTab={defaultTab} />
  );
}
