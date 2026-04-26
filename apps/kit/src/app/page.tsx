import { auth } from "@clerk/nextjs/server";

import { Hero } from "@/components/landing/hero";
import { RecentKitsGrid } from "@/components/landing/recent-kits-grid";
import { SiteHeader } from "@/components/landing/site-header";

export default async function Page() {
  const { userId } = await auth();
  const isSignedIn = Boolean(userId);

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-tx)]">
      <SiteHeader isSignedIn={isSignedIn} stars={532} />
      <Hero isSignedIn={isSignedIn} />

      <section
        className="border-[var(--color-ui)] border-b"
        id="gallery"
      >
        <div className="mx-auto max-w-[1200px] px-6 py-16">
          <div className="mb-10 grid gap-3 border-[var(--color-ui)] border-b pb-6 sm:flex sm:items-end sm:justify-between sm:gap-6">
            <div>
              <p className="font-mono text-[11px] text-[var(--color-tx-2)] uppercase tracking-[0.18em]">
                <span className="text-[var(--color-ac-2)]">●</span> Gallery
              </p>
              <h2 className="mt-2 font-serif text-[40px] text-[var(--color-tx)] leading-[1.05] sm:text-[48px]">
                Brands shipped this week
              </h2>
            </div>
            <a
              className="text-[13px] text-[var(--color-tx-2)] underline-offset-4 hover:text-[var(--color-tx)] hover:underline"
              href="/examples"
            >
              See all kits ↗
            </a>
          </div>
          <RecentKitsGrid limit={6} />
        </div>
      </section>

      <section
        className="border-[var(--color-ui)] border-b"
        id="models"
      >
        <div className="mx-auto max-w-[1200px] px-6 py-16">
          <p className="font-mono text-[11px] text-[var(--color-tx-2)] uppercase tracking-[0.18em]">
            <span className="text-[var(--color-ac-2)]">●</span> Why three models
          </p>
          <h2 className="mt-2 max-w-[18ch] font-serif text-[40px] text-[var(--color-tx)] leading-[1.05] sm:text-[48px]">
            One model is never enough.
          </h2>
          <div className="mt-10 grid gap-px border border-[var(--color-ui)] bg-[var(--color-ui)] sm:grid-cols-3">
            {[
              {
                model: "Recraft V4",
                claim: "Wins on lettering",
                detail:
                  "Wordmarks, ligatures, kerning — Sycomore tested every model and Recraft came out on top every time. We use it for the logo and three variations.",
              },
              {
                model: "Flux 1.1 Pro Ultra",
                claim: "Wins on atmosphere",
                detail:
                  "Painterly gradients, abstract moodboards, brand-feel imagery. Replaces Midjourney with an actual API and similar fidelity.",
              },
              {
                model: "GPT Image 2",
                claim: "Wins on composition",
                detail:
                  "Multi-image input native. Takes the seven assets above and assembles a polished bento brand sheet in one shot.",
              },
            ].map((item) => (
              <div className="bg-[var(--color-bg)] p-6" key={item.model}>
                <p className="font-mono text-[10px] text-[var(--color-tx-3)] uppercase tracking-[0.18em]">
                  {item.claim}
                </p>
                <h3 className="mt-2 font-serif text-[28px] text-[var(--color-tx)] leading-tight">
                  {item.model}
                </h3>
                <p className="mt-3 text-[13px] text-[var(--color-tx-2)] leading-6">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-6 py-8 text-[12px] text-[var(--color-tx-3)]">
        <span className="font-mono uppercase tracking-[0.14em]">
          kit.tinte.dev
        </span>
        <span>© Tinte · A Crafter Station product</span>
      </footer>
    </main>
  );
}
