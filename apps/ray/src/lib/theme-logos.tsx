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

type LogoComponent = (props: { className?: string }) => JSX.Element;

export const THEME_LOGOS: Record<string, LogoComponent> = {
  linear: ({ className }) => <LinearLogo className={className} variant="logo" />,
  perplexity: ({ className }) => <PerplexityLogo className={className} />,
  "trigger-dev": ({ className }) => <TriggerLogo className={className} />,
  clerk: ({ className }) => <ClerkLogo className={className} />,
  chatgpt: ({ className }) => <OpenAILogo className={className} />,
  supabase: ({ className }) => <SupabaseLogo className={className} />,
  vercel: ({ className }) => <VercelLogo className={className} />,
  "crafter-station": ({ className }) => <CrafterStationLogo className={className} />,
  kebo: ({ className }) => <KeboLogo className={className} />,
  tailwind: ({ className }) => <TailwindcssLogo className={className} />,
};
