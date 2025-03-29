"use client";

import { Button } from "@/components/ui/button";
import React from "react";

import { useShadcnSelectedTheme } from "@/hooks/use-shadcn-selected-theme";
import { useAuth } from "@clerk/nextjs";
import { GitForkIcon, Loader2Icon } from "lucide-react";
import { forkTheme } from "./action";

export function Fork() {
  const [state, formAction, isPending] = React.useActionState(forkTheme, {
    success: false,
  });

  const { setSelectedThemeId, data: selectedTheme } = useShadcnSelectedTheme();

  React.useEffect(() => {
    if (state.success) {
      setSelectedThemeId(state.newThemeId);
    }
  }, [state, setSelectedThemeId]);

  const { userId } = useAuth();

  if (!userId) {
    return null;
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="themeId" defaultValue={selectedTheme?.id} />
      <Button
        variant="secondary"
        className="w-48"
        type="submit"
        disabled={isPending}
      >
        {isPending ? (
          <Loader2Icon className="mr-1 size-4 animate-spin" />
        ) : (
          <GitForkIcon className="mr-1 size-4" />
        )}
        Fork
      </Button>
    </form>
  );
}
