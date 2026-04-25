import { SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

import { Hero } from "@/components/landing/hero";
import { RecentKitsGrid } from "@/components/landing/recent-kits-grid";

export default async function Page() {
  const { userId } = await auth();

  return (
    <main className="min-h-screen px-6 py-6">
      <nav className="mx-auto flex max-w-5xl items-center justify-between border-[#2b2925] border-b pb-5">
        <a className="font-semibold text-lg" href="/">
          kit.tinte.dev
        </a>
        {userId ? (
          <UserButton />
        ) : (
          <SignInButton mode="modal">
            <button className="h-10 rounded-md border border-[#3a372f] px-4 text-sm">
              Sign in
            </button>
          </SignInButton>
        )}
      </nav>
      <Hero isSignedIn={Boolean(userId)} />
      <section className="mx-auto grid max-w-6xl gap-6 pb-16">
        <div className="flex items-end justify-between gap-4">
          <div className="grid gap-2">
            <p className="text-[#d8ff5f] text-sm uppercase tracking-[0.18em]">
              Recent kits
            </p>
            <h2 className="font-semibold text-3xl">Public examples</h2>
          </div>
          <a
            className="text-[#a7a096] text-sm hover:text-[#f4f1e8]"
            href="/examples"
          >
            View all
          </a>
        </div>
        <RecentKitsGrid />
      </section>
    </main>
  );
}
