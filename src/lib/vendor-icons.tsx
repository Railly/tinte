import {
  ChatGPTIcon,
  ClerkIcon,
  CrafterStationIcon,
  ElevenLabsIcon,
  KeboIcon,
  LinearIcon,
  PerplexityIcon,
  SpotifyIcon,
  SupabaseIcon,
  TailwindIcon,
  TriggerIcon,
  VercelIcon,
} from "@/components/shared/icons";

export const VENDOR_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }> | null
> = {
  triggerdev: TriggerIcon,
  vercel: VercelIcon,
  elevenlabs: ElevenLabsIcon,
  clerk: ClerkIcon,
  chatgpt: ChatGPTIcon,
  tailwind: TailwindIcon,
  supabase: SupabaseIcon,
  perplexity: PerplexityIcon,
  linear: LinearIcon,
  kebo: KeboIcon,
  "crafter-station": CrafterStationIcon,
  spotify: SpotifyIcon,
  sketchpad: null, // No icon provided
  "8-bit-gameboy": null, // Uses image instead
  "one-hunter": null, // No icon provided
};

export const VENDOR_IMAGES: Record<string, string> = {
  "8-bit-gameboy": "/avatars/orcdev.webp",
};

export function getVendorIcon(
  slug: string,
): React.ComponentType<{ className?: string }> | null {
  return VENDOR_ICONS[slug] || null;
}

export function getVendorImage(slug: string): string | null {
  return VENDOR_IMAGES[slug] || null;
}
