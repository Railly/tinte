export const GRADIENTS = [
  {
    id: "midnight",
    name: "Midnight",
    css: "linear-gradient(145deg, #0a0a1a 0%, #1a1a3e 100%)",
  },
  {
    id: "sunset",
    name: "Sunset",
    css: "linear-gradient(145deg, #2d1b69 0%, #7b2ff2 50%, #ff7eb3 100%)",
  },
  {
    id: "ocean",
    name: "Ocean",
    css: "linear-gradient(145deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
  },
  {
    id: "forest",
    name: "Forest",
    css: "linear-gradient(145deg, #0b3d0b 0%, #1a5c1a 100%)",
  },
  {
    id: "ember",
    name: "Ember",
    css: "linear-gradient(145deg, #1a0a0a 0%, #4a1a1a 100%)",
  },
  {
    id: "steel",
    name: "Steel",
    css: "linear-gradient(145deg, #1a1a1a 0%, #333333 100%)",
  },
  {
    id: "aurora",
    name: "Aurora",
    css: "linear-gradient(145deg, #0c0c1d 0%, #1a3a5c 50%, #2a7a5c 100%)",
  },
  { id: "none", name: "Transparent", css: "transparent" },
] as const;

export type GradientId = (typeof GRADIENTS)[number]["id"];

export function resolveBackground(value: string): string {
  const preset = GRADIENTS.find((g) => g.id === value);
  if (preset) return preset.css;
  if (value.startsWith("#")) return deriveGradientFromColor(value);
  return GRADIENTS[0].css;
}

export function deriveGradientFromColor(hex: string): string {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  const darker = `#${Math.max(0, r - 30).toString(16).padStart(2, "0")}${Math.max(0, g - 30).toString(16).padStart(2, "0")}${Math.max(0, b - 30).toString(16).padStart(2, "0")}`;
  const lighter = `#${Math.min(255, r + 20).toString(16).padStart(2, "0")}${Math.min(255, g + 20).toString(16).padStart(2, "0")}${Math.min(255, b + 20).toString(16).padStart(2, "0")}`;
  return `linear-gradient(145deg, ${darker} 0%, ${hex} 50%, ${lighter} 100%)`;
}
