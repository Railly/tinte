import { SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

import { BriefForm } from "./brief-form";

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
      <section className="mx-auto grid max-w-5xl gap-10 py-16 md:grid-cols-[1fr_420px] md:items-start">
        <div className="space-y-6">
          <p className="text-[#d8ff5f] text-sm uppercase tracking-[0.18em]">
            Multi-model brand kit generator
          </p>
          <h1 className="max-w-2xl font-semibold text-5xl leading-[1.02] md:text-7xl">
            Turn a rough product idea into a brand kit.
          </h1>
          <p className="max-w-xl text-[#a7a096] text-lg leading-7">
            Logo, variations, moodboard, and bento composition generated through
            the kit pipeline.
          </p>
        </div>
        <BriefForm isSignedIn={Boolean(userId)} />
      </section>
    </main>
  );
}
