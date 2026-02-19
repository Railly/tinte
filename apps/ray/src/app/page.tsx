import { Suspense } from "react";
import { RayEditor } from "@/components/ray-editor";
import { ApiDialog } from "@/components/api-dialog";
import { GithubStars } from "@/components/github-stars";

export default function Home() {
  return (
    <div className="flex flex-col h-dvh">
      <header className="flex items-center justify-between px-5 h-12 shrink-0 border-b">
        <span className="text-sm font-mono font-semibold tracking-tight text-foreground">
          ray.tinte.dev
        </span>
        <div className="flex items-center gap-3">
          <ApiDialog defaultTab="skill" />
          <GithubStars />
          <a
            href="https://tinte.railly.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Powered by Tinte
          </a>
        </div>
      </header>
      <main className="flex-1 min-h-0">
        <Suspense>
          <RayEditor />
        </Suspense>
      </main>
    </div>
  );
}
