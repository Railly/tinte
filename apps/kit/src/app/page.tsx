import { auth } from "@clerk/nextjs/server";

import { Hero } from "@/components/landing/hero";
import { RecentKitsGrid } from "@/components/landing/recent-kits-grid";
import { SiteHeader } from "@/components/landing/site-header";

export default async function Page() {
  const { userId } = await auth();
  const isSignedIn = Boolean(userId);

  return (
    <main className="min-h-screen bg-[#0c0c0b] text-[#f4f1e8]">
      <SiteHeader isSignedIn={isSignedIn} stars={532} />
      <Hero isSignedIn={isSignedIn} />
      <section
        className="mx-auto max-w-6xl px-6 pb-24"
        id="gallery"
      >
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="font-medium text-[#d8ff5f] text-xs uppercase tracking-[0.22em]">
              Gallery
            </p>
            <h2 className="mt-2 font-semibold text-3xl text-[#f4f1e8] tracking-tight">
              Recent brands
            </h2>
          </div>
          <a
            className="text-[#a7a096] text-sm transition-colors hover:text-[#f4f1e8]"
            href="/examples"
          >
            View all →
          </a>
        </div>
        <RecentKitsGrid limit={6} />
      </section>
    </main>
  );
}
