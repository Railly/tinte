import { Suspense } from "react";
import { RayEditor } from "@/components/ray-editor";
import { GithubStars } from "@/components/github-stars";
import { TinteLogo } from "@/components/logos/tinte";

export default function Home() {
  return (
    <div className="flex flex-col h-dvh">
      <header className="flex items-center justify-between px-5 h-12 shrink-0 border-b">
        <div className="flex items-center gap-2.5">
          <a
            href="https://tinte.railly.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Powered by Tinte"
          >
            <TinteLogo className="size-5" />
          </a>
          <span className="text-sm font-mono font-semibold tracking-tight text-foreground">
            ray.tinte.dev
          </span>
        </div>
        <GithubStars />
      </header>
      <main className="flex-1 min-h-0">
        <Suspense>
          <RayEditor />
        </Suspense>
      </main>
    </div>
  );
}
