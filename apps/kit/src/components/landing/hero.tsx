import { BriefForm } from "@/app/brief-form";

interface HeroProps {
  isSignedIn: boolean;
}

const PIPELINE = [
  {
    step: "01",
    model: "Recraft V4",
    role: "Logo + variations",
    note: "Best lettering in class",
  },
  {
    step: "02",
    model: "Flux 1.1 Pro Ultra",
    role: "Aesthetic moodboard",
    note: "Painterly, abstract, gradient",
  },
  {
    step: "03",
    model: "GPT Image 2",
    role: "Bento composition",
    note: "Multi-image reference assembly",
  },
];

export function Hero({ isSignedIn }: HeroProps) {
  return (
    <section className="border-[var(--color-ui)] border-b">
      <div className="mx-auto max-w-[1200px] px-6 pt-20 pb-16 lg:grid lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:pt-24">
        <div>
          <p className="font-mono text-[11px] text-[var(--color-tx-2)] uppercase tracking-[0.18em]">
            <span className="text-[var(--color-ac-2)]">●</span> Multi-model brand
            pipeline · v0.1
          </p>
          <h1 className="mt-6 font-serif text-[64px] text-[var(--color-tx)] leading-[0.96] sm:text-[80px] lg:text-[96px]">
            Design <em className="text-[var(--color-ac-2)]">your</em>
            <br />
            brand.
          </h1>
          <p className="mt-6 max-w-[44ch] text-[15px] text-[var(--color-tx-2)] leading-7">
            Brand kits route to specialized models — Recraft for lettering,
            Flux for atmosphere, GPT Image 2 for composition. You write the
            brief; we orchestrate the rest.
          </p>

          <div className="mt-12 lg:hidden">
            <BriefForm isSignedIn={isSignedIn} />
          </div>

          <div
            className="mt-14 grid gap-px overflow-hidden rounded border border-[var(--color-ui)] bg-[var(--color-ui)] sm:grid-cols-3"
            id="how"
          >
            {PIPELINE.map((item) => (
              <div
                className="bg-[var(--color-bg)] p-4 transition-colors hover:bg-[var(--color-bg-2)]"
                key={item.step}
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[11px] text-[var(--color-tx-3)]">
                    {item.step}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--color-tx-3)] uppercase tracking-[0.12em]">
                    Step
                  </span>
                </div>
                <div className="mt-3 font-medium text-[14px] text-[var(--color-tx)]">
                  {item.model}
                </div>
                <div className="mt-1 text-[12px] text-[var(--color-tx-2)]">
                  {item.role}
                </div>
                <div className="mt-3 border-[var(--color-ui)] border-t pt-3 font-mono text-[10px] text-[var(--color-tx-3)] uppercase tracking-[0.1em]">
                  {item.note}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block">
          <BriefForm isSignedIn={isSignedIn} />
        </div>
      </div>
    </section>
  );
}
