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
  "8-bit-gameboy": null, // No icon provided
  "one-hunter": null, // No icon provided
};

export function getVendorIcon(
  slug: string,
): React.ComponentType<{ className?: string }> | null {
  return VENDOR_ICONS[slug] || null;
}
