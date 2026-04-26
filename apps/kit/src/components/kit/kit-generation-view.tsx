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

const slots: Array<{
  type: SlotType;
  title: string;
  count: number;
  step: KitGenerationStep;
}> = [
  { type: "logo", title: "Logo", count: 1, step: "generating_logo" },
  {
    type: "logo_variation",
    title: "Variations",
    count: 3,
    step: "generating_logo",
  },
  {
    type: "moodboard",
    title: "Moodboard",
    count: 3,
    step: "generating_moodboard",
  },
  { type: "bento", title: "Bento", count: 1, step: "composing_bento" },
];

const steps = new Set<KitGenerationStep>([
  "drafting_prompts",
  "generating_logo",
  "generating_moodboard",
  "composing_bento",
  "completed",
]);

const stepOrder: KitGenerationStep[] = [
  "drafting_prompts",
  "generating_logo",
  "generating_moodboard",
  "composing_bento",
  "completed",
];

function getCurrentStep(value: unknown): KitGenerationStep | null {
  return typeof value === "string" && steps.has(value as KitGenerationStep)
    ? (value as KitGenerationStep)
    : null;
}

function getAssetUrls(value: unknown, type: SlotType): string[] {
  if (!value || typeof value !== "object") return [];
  const urls = (value as Partial<Record<SlotType, unknown>>)[type];
  if (!Array.isArray(urls)) return [];
  return urls.filter((url): url is string => typeof url === "string");
}

function isStepActive(
  current: KitGenerationStep | null,
  slotStep: KitGenerationStep,
) {
  if (!current) return false;
  return stepOrder.indexOf(current) === stepOrder.indexOf(slotStep);
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
      { logo: [], logo_variation: [], moodboard: [], bento: [] },
    );
  }, [kit.assets]);

  async function retryGeneration() {
    setRetryError(null);
    setIsRetrying(true);

    let response: Response;
    try {
      response = await fetch(`/api/kit/${kit.id}/retry`, { method: "POST" });
    } catch (err) {
      setIsRetrying(false);
      setRetryError(err instanceof Error ? err.message : "Network error");
      return;
    }

    const text = await response.text();
    let payload: { kitId?: string; runId?: string; error?: string } = {};
    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      setIsRetrying(false);
      setRetryError(
        `Server returned non-JSON (${response.status}): ${text.slice(0, 120)}`,
      );
      return;
    }

    setIsRetrying(false);

    if (!response.ok || !payload.runId) {
      setRetryError(payload.error ?? `Retry failed (${response.status})`);
      return;
    }

    router.replace(`/k/${payload.kitId}`);
    router.refresh();
  }

  return (
    <div className="grid gap-6">
      <div
        className="rounded-lg border p-5"
        style={{
          borderColor: "var(--color-ui)",
          background: "var(--color-bg-2)",
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <StepLabel currentStep={currentStep} isComplete={isComplete} />
          <span
            className="font-mono text-[10px] uppercase tracking-[0.16em]"
            style={{ color: "var(--color-tx-3)" }}
          >
            {run?.status?.toLowerCase() ?? "loading"}
          </span>
        </div>
        <div className="mt-4">
          <ProgressBar currentStep={currentStep} isComplete={isComplete} />
        </div>
        {error ? (
          <p
            className="mt-3 text-[12px]"
            style={{ color: "var(--color-sc)" }}
          >
            Live updates reconnecting…
          </p>
        ) : null}
        {isFailed ? (
          <div
            className="mt-4 grid gap-3 rounded border p-4"
            style={{
              borderColor: "color-mix(in oklab, var(--color-ac-1) 40%, transparent)",
              background: "color-mix(in oklab, var(--color-ac-1) 8%, transparent)",
            }}
          >
            <p
              className="font-medium text-[13px]"
              style={{ color: "var(--color-ac-1)" }}
            >
              Generation failed
            </p>
            <p className="text-[12px]" style={{ color: "var(--color-tx-2)" }}>
              The run stopped before the kit was completed.
            </p>
            {retryError ? (
              <p className="text-[11px]" style={{ color: "var(--color-ac-1)" }}>
                {retryError}
              </p>
            ) : null}
            <button
              className="h-8 w-fit rounded px-3 font-medium text-[12px] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isRetrying}
              onClick={retryGeneration}
              style={{
                background: "var(--color-tx)",
                color: "var(--color-bg)",
              }}
              type="button"
            >
              {isRetrying ? "Retrying…" : "Retry generation"}
            </button>
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {slots.map((slot) => {
          const liveUrls = getAssetUrls(metadata?.assets, slot.type);
          const urls =
            liveUrls.length > 0 ? liveUrls : fallbackAssets[slot.type];
          const active = !isComplete && isStepActive(currentStep, slot.step);

          return (
            <KitCardSlot
              active={active}
              alt={`${kit.name} ${slot.title}`}
              count={slot.count}
              key={slot.type}
              step={slot.step.replace("generating_", "").replace("_", " ")}
              title={slot.title}
              urls={urls}
            />
          );
        })}
      </div>
    </div>
  );
}
