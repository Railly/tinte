import type { KitGenerationStep } from "./progress-bar";

const labels: Record<KitGenerationStep, string> = {
  drafting_prompts: "Drafting prompts...",
  generating_logo: "Generating logo...",
  generating_moodboard: "Composing moodboard...",
  composing_bento: "Composing bento...",
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
      : "Queued for generation...";

  return (
    <p className="rounded-full border border-[#3a372f] px-3 py-1 text-[#a7a096] text-sm">
      {label}
    </p>
  );
}
