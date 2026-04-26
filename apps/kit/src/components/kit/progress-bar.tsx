const stepProgress = {
  drafting_prompts: 15,
  generating_logo: 40,
  generating_moodboard: 70,
  composing_bento: 90,
  completed: 100,
} as const;

export type KitGenerationStep = keyof typeof stepProgress;

interface ProgressBarProps {
  currentStep: KitGenerationStep | null;
  isComplete: boolean;
}

export function ProgressBar({ currentStep, isComplete }: ProgressBarProps) {
  const progress = isComplete
    ? 100
    : currentStep
      ? stepProgress[currentStep]
      : 0;

  return (
    <div className="grid gap-1.5">
      <div className="flex items-baseline justify-between">
        <span
          className="font-mono text-[10px] uppercase tracking-[0.16em]"
          style={{ color: "var(--color-tx-2)" }}
        >
          Progress
        </span>
        <span
          className="font-mono text-[10px]"
          style={{ color: "var(--color-tx-2)" }}
        >
          {progress}%
        </span>
      </div>
      <div
        className="h-1 overflow-hidden rounded-full"
        style={{ background: "var(--color-ui)" }}
      >
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{
            width: `${progress}%`,
            background: "var(--color-tx)",
          }}
        />
      </div>
    </div>
  );
}
