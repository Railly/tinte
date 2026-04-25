"use client";

import { useRun } from "@trigger.dev/react-hooks";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { KitCardSlot } from "./kit-card-slot";
import { type KitGenerationStep, ProgressBar } from "./progress-bar";
import { StepLabel } from "./step-label";

type SlotType = "logo" | "logo_variation" | "moodboard" | "bento";

interface KitAssetSnapshot {
  id: string;
  type: SlotType;
  url: string;
}

interface KitSnapshot {
  id: string;
  name: string;
  description: string;
  status: "queued" | "generating" | "completed" | "failed";
  assets: KitAssetSnapshot[];
}

interface RunMetadata {
  currentStep?: unknown;
  assets?: unknown;
}

const slots: Array<{ type: SlotType; title: string }> = [
  { type: "logo", title: "Logo" },
  { type: "logo_variation", title: "Logo variations" },
  { type: "moodboard", title: "Moodboard" },
  { type: "bento", title: "Bento" },
];

const steps = new Set<KitGenerationStep>([
  "drafting_prompts",
  "generating_logo",
  "generating_moodboard",
  "composing_bento",
  "completed",
]);

function getCurrentStep(value: unknown): KitGenerationStep | null {
  return typeof value === "string" && steps.has(value as KitGenerationStep)
    ? (value as KitGenerationStep)
    : null;
}

function getAssetUrls(value: unknown, type: SlotType): string[] {
  if (!value || typeof value !== "object") {
    return [];
  }

  const urls = (value as Partial<Record<SlotType, unknown>>)[type];
  if (!Array.isArray(urls)) {
    return [];
  }

  return urls.filter((url): url is string => typeof url === "string");
}

interface KitGenerationViewProps {
  runId: string;
  accessToken: string;
  kit: KitSnapshot;
}

export function KitGenerationView({
  runId,
  accessToken,
  kit,
}: KitGenerationViewProps) {
  const router = useRouter();
  const [retryError, setRetryError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const { run, error } = useRun(runId, { accessToken, refreshInterval: 1000 });
  const metadata = run?.metadata as RunMetadata | undefined;
  const currentStep = getCurrentStep(metadata?.currentStep);
  const isComplete = run?.status === "COMPLETED" || kit.status === "completed";
  const isFailed =
    run?.status === "FAILED" ||
    run?.status === "CRASHED" ||
    run?.status === "TIMED_OUT" ||
    kit.status === "failed";

  const fallbackAssets = useMemo(() => {
    return slots.reduce<Record<SlotType, string[]>>(
      (accumulator, slot) => {
        accumulator[slot.type] = kit.assets
          .filter((asset) => asset.type === slot.type)
          .map((asset) => asset.url);
        return accumulator;
      },
      {
        logo: [],
        logo_variation: [],
        moodboard: [],
        bento: [],
      },
    );
  }, [kit.assets]);

  async function retryGeneration() {
    setRetryError(null);
    setIsRetrying(true);

    const response = await fetch(`/api/kit/${kit.id}/retry`, {
      method: "POST",
    });
    const payload = (await response.json()) as
      | { kitId: string; runId: string }
      | { error?: string };

    setIsRetrying(false);

    if (!response.ok || !("runId" in payload)) {
      setRetryError(
        "error" in payload ? (payload.error ?? "Retry failed") : "Retry failed",
      );
      return;
    }

    router.replace(`/k/${payload.kitId}`);
    router.refresh();
  }

  return (
    <div className="grid gap-8">
      <div className="flex flex-col gap-4 rounded-lg border border-[#2b2925] bg-[#171613] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <StepLabel currentStep={currentStep} isComplete={isComplete} />
          <span className="text-[#a7a096] text-sm">
            Run {run?.status.toLowerCase() ?? "loading"}
          </span>
        </div>
        <ProgressBar currentStep={currentStep} isComplete={isComplete} />
        {error ? (
          <p className="text-[#ffb36e] text-sm">
            Live updates are reconnecting.
          </p>
        ) : null}
        {isFailed ? (
          <div className="grid gap-3 rounded-md border border-[#5b2d2d] bg-[#241616] p-4">
            <p className="font-medium text-[#ff7a7a]">Generation failed</p>
            <p className="text-[#c6b8ad] text-sm">
              The run stopped before the kit was completed.
            </p>
            {retryError ? (
              <p className="text-[#ff7a7a] text-sm">{retryError}</p>
            ) : null}
            <button
              className="h-10 w-fit rounded-md bg-[#d8ff5f] px-4 font-medium text-[#10110a] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isRetrying}
              onClick={retryGeneration}
              type="button"
            >
              {isRetrying ? "Retrying..." : "Retry generation"}
            </button>
          </div>
        ) : null}
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {slots.map((slot) => {
          const liveUrls = getAssetUrls(metadata?.assets, slot.type);
          const urls =
            liveUrls.length > 0 ? liveUrls : fallbackAssets[slot.type];

          return (
            <KitCardSlot
              alt={`${kit.name} ${slot.title}`}
              key={slot.type}
              title={slot.title}
              urls={urls}
            />
          );
        })}
      </div>
    </div>
  );
}
