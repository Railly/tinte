import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import { WorkbenchMain } from "@/components/workbench/workbench-main";
import { WorkbenchHeader } from "@/components/workbench/workbench-header";
import { workbenchCache } from "../search-params";

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
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;

  // Parse search params server-side with nuqs
  const { new: isNew } = await workbenchCache.parse(searchParams);
  const isStatic = isNew;

  // For static mode, default to design tab; otherwise agent
  const defaultTab = isStatic ? "agent" : "colors";

  return (
    <div className="flex flex-col min-h-screen">
      <WorkbenchHeader chatId={id} />
      <WorkbenchMain chatId={id} isStatic={isStatic} defaultTab={defaultTab} />
    </div>
  );
}
