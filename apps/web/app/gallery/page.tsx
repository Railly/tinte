import React from "react";
import { getAllThemes } from "@/lib/api";
import { GalleryContent } from "./gallery-content";
import { ShineButton } from "@/components/ui/shine-button";
import Link from "next/link";
import { GeneralHeader } from "@/components/general-header";

export default async function GalleryPage() {
  const allThemes = await getAllThemes();

  return (
    <>
      <GeneralHeader />
      <main className="flex flex-col items-center py-8 px-4 md:px-8">
        <div className="w-full flex justify-between items-center mb-8">
          <div className="flex-1" />
          <h1 className="text-xl md:text-3xl font-bold text-center">
            Theme Gallery
          </h1>
          <div className="flex-1 flex justify-end">
            <Link href="/vscode">
              <ShineButton>Create Your Theme</ShineButton>
            </Link>
          </div>
        </div>
        <GalleryContent allThemes={allThemes} />
      </main>
    </>
  );
}
