import type { KitGenerationStep } from "./progress-bar";

const labels: Record<KitGenerationStep, string> = {
  drafting_prompts: "Drafting prompts",
  generating_logo: "Generating logo",
  generating_moodboard: "Composing moodboard",
  composing_bento: "Assembling bento",
  completed: "Kit complete",
};

interface StepLabelProps {
  currentStep: KitGenerationStep | null;
  isComplete: boolean;
}

export function StepLabel({ currentStep, isComplete }: StepLabelProps) {
  const label = isComplete
    ? labels.completed
    : currentStep
      ? labels[currentStep]
      : "Queued";

  return (
    <span
      className="inline-flex h-6 items-center gap-2 rounded-full border px-2.5 text-[11px]"
      style={{
        borderColor: "var(--color-ui)",
        background: "var(--color-bg)",
        color: "var(--color-tx-2)",
      }}
    >
      {!isComplete ? (
        <span
          className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
          style={{ background: "var(--color-ac-2)" }}
        />
      ) : (
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: "var(--color-ac-2)" }}
        />
      )}
      {label}
    </span>
  );
}
