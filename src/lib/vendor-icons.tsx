import { ChatGPTIcon } from "@/components/shared/icons/chatgpt";
import { ClerkIcon } from "@/components/shared/icons/clerk";
import { ElevenLabsIcon } from "@/components/shared/icons/elevenlabs";
import { SupabaseIcon } from "@/components/shared/icons/supabase";
import { TailwindIcon } from "@/components/shared/icons/tailwind";
import { TriggerIcon } from "@/components/shared/icons/trigger";
import { VercelIcon } from "@/components/shared/icons/vercel";

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
