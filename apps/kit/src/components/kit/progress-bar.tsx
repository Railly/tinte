const stepProgress = {
  drafting_prompts: 25,
  generating_logo: 50,
  generating_moodboard: 75,
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
    <div className="grid gap-2">
      <div className="flex items-center justify-between text-[#a7a096] text-sm">
        <span>Generation progress</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#2b2925]">
        <div
          className="h-full rounded-full bg-[#d8ff5f] transition-[width] duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
