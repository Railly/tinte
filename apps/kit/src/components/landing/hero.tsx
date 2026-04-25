import { BriefForm } from "@/app/brief-form";

interface HeroProps {
  isSignedIn: boolean;
}

export function Hero({ isSignedIn }: HeroProps) {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 py-16 md:grid-cols-[1fr_420px] md:items-start">
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
        <a
          className="inline-flex h-11 items-center rounded-md border border-[#3a372f] px-4 font-medium text-sm hover:border-[#d8ff5f]"
          href="/examples"
        >
          See examples
        </a>
      </div>
      <BriefForm isSignedIn={isSignedIn} />
    </section>
  );
}
