import { redirect } from "next/navigation";
import { nanoid } from "nanoid";
import { Suspense } from "react";
import {
  getRaysoThemes,
  getThemesWithUsers,
  getTinteThemes,
  getTweakCNThemes,
} from "@/lib/user-themes";
import { WorkbenchPromptGenerator } from "@/components/workbench/workbench-prompt-generator";

interface WorkbenchPageProps {
  searchParams: Promise<{ prompt?: string }>;
}

export default async function WorkbenchPage({ searchParams }: WorkbenchPageProps) {
  const { prompt } = await searchParams;

  // If there's a prompt, show the generation UI
  if (prompt) {
    return (
      <Suspense fallback={<div>Loading workbench...</div>}>
        <WorkbenchPromptGenerator prompt={prompt} />
      </Suspense>
    );
  }

  // Otherwise, redirect to default theme
  const [userThemes, tweakCNThemes, tinteThemes, raysoThemes] = await Promise.all([
    getThemesWithUsers(5), // Just get a few user themes
    getTweakCNThemes(),
    getTinteThemes(),
    getRaysoThemes(),
  ]);

  // Get all themes and find the first one with a slug
  const allThemes = [...userThemes, ...tweakCNThemes, ...tinteThemes, ...raysoThemes];
  const firstThemeWithSlug = allThemes.find(theme => theme.slug);

  // Use first theme slug if available, otherwise generate random ID
  const workbenchId = firstThemeWithSlug?.slug || nanoid();

  redirect(`/workbench/${workbenchId}`);
}
