import { Suspense } from "react";
import { RayEditor } from "@/components/ray-editor";

export default function Home() {
  return (
    <div className="flex flex-col h-dvh">
      <header className="flex items-center justify-between px-5 h-12 shrink-0 border-b border-[var(--border)]">
        <span className="text-sm font-mono font-semibold tracking-tight text-[var(--foreground)]">
          ray.tinte.dev
        </span>
        <a
          href="https://tinte.railly.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          Powered by Tinte
        </a>
      </header>
      <main className="flex-1 min-h-0">
        <Suspense>
          <RayEditor />
        </Suspense>
      </main>
    </div>
  );
}
