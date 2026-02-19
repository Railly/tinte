import type { JSX } from "react";
import { LinearLogo } from "@/components/logos/linear";
import { PerplexityLogo } from "@/components/logos/perplexity";
import { TriggerLogo } from "@/components/logos/trigger";
import { ClerkLogo } from "@/components/logos/clerk";
import { OpenAILogo } from "@/components/logos/openai";
import { SupabaseLogo } from "@/components/logos/supabase";
import { VercelLogo } from "@/components/logos/vercel";
import { CrafterStationLogo } from "@/components/logos/crafter-station";
import { KeboLogo } from "@/components/logos/kebo";
import { TailwindcssLogo } from "@/components/logos/tailwindcss";

export type LogoComponent = (props: {
  className?: string;
  mode?: "light" | "dark";
}) => JSX.Element;

export const THEME_LOGOS: Record<string, LogoComponent> = {
  linear: ({ className, mode = "dark" }) => (
    <LinearLogo className={className} variant="logo" mode={mode} />
  ),
  perplexity: ({ className }) => <PerplexityLogo className={className} />,
  triggerdev: ({ className, mode = "dark" }) => (
    <TriggerLogo className={className} colorScheme="colorful" mode={mode} />
  ),
  clerk: ({ className, mode = "dark" }) => (
    <ClerkLogo className={className} mode={mode} />
  ),
  chatgpt: ({ className }) => <OpenAILogo className={className} />,
  supabase: ({ className }) => <SupabaseLogo className={className} />,
  vercel: ({ className }) => <VercelLogo className={className} />,
  "crafter-station": ({ className }) => (
    <CrafterStationLogo className={className} />
  ),
  kebo: ({ className }) => <KeboLogo className={className} />,
  tailwind: ({ className }) => <TailwindcssLogo className={className} />,
  elevenlabs: ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>ElevenLabs</title>
      <path d="M7 4h3v16H7V4zm7 0h3v16h-3V4z" />
    </svg>
  ),
};
