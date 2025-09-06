"use client";

import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loading } from "@/components/loading";

export default function WorkbenchPage() {
  const router = useRouter();

  useEffect(() => {
    const chatId = nanoid();
    router.replace(`/workbench/${chatId}?new=true`);
  }, [router]);

  // Reuse the same loading structure as loading.tsx to prevent layout shift
  return (
    <div className="flex h-[calc(100dvh-var(--header-height))] items-center justify-center">
      <Loading />
    </div>
  );
}
