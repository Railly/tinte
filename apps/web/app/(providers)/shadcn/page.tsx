import React from "react";
import { Footer } from "./components/footer";
import { getThemes } from "@/lib/actions/shadcn-theme-actions";
import { ThemeWorkspace } from "./components/theme-workspace";
import { cookies } from "next/headers";
import { TinteForShadcnModal } from "@/components/tinte-for-shadcn-modal";

export default async function ShadcnThemesPage() {
  const { themes, pagination } = await getThemes(1, 5);
  const cookieStore = cookies();
  const hasSeenModal = cookieStore.get("hasSeenTinteForShadcnModal");

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <ThemeWorkspace allThemes={themes} initialPagination={pagination} />
      <Footer />
      {!hasSeenModal && <TinteForShadcnModal />}
    </div>
  );
}
