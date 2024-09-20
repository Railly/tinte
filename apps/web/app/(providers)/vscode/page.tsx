import React from "react";
import { cookies } from "next/headers";
import { ThemeManager } from "@/components/theme-manager";
import { GeneralHeader } from "@/components/general-header";
import { TinteForShadcnModal } from "@/components/tinte-for-shadcn-modal";
import { getInitialThemes } from "@/lib/api";

export default async function Page() {
  const initialThemes = await getInitialThemes();
  const cookieStore = cookies();
  const hasSeenModal = cookieStore.get("hasSeenTinteForShadcnModal");

  return (
    <>
      <GeneralHeader />
      <ThemeManager initialThemes={initialThemes} />
      {!hasSeenModal && <TinteForShadcnModal />}
    </>
  );
}
