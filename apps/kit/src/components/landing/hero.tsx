import { BriefForm } from "@/app/brief-form";

interface HeroProps {
  isSignedIn: boolean;
}

export function Hero({ isSignedIn }: HeroProps) {
  return (
    <section className="mx-auto max-w-3xl px-6 pt-20 pb-16 text-center">
      <p className="font-medium text-[#d8ff5f] text-xs uppercase tracking-[0.22em]">
        Multi-model brand kit generator
      </p>
      <h1 className="mt-6 font-semibold text-5xl text-[#f4f1e8] leading-[1.05] tracking-tight md:text-6xl">
        Design your brand.
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-[#a7a096] text-lg leading-7">
        Logo, variations, moodboard, and bento composition. Built through a
        multi-model pipeline so each piece comes from the model that does it
        best.
      </p>
      <div className="mt-12">
        <BriefForm isSignedIn={isSignedIn} />
      </div>
    </section>
  );
}
