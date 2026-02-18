export const PROMPT_INPUT_PRESETS = [
  {
    icon: "🏢",
    text: "Corporate Blue",
    primaryColor: "#1e40af",
    neutralColor: "#64748b",
    backgroundColor: "#ffffff",
    prompt:
      "Create a professional corporate theme with trustworthy blue tones. Focus on accessibility, clean typography, and a business-appropriate aesthetic. Use blues ranging from navy to lighter shades, with neutral grays for balance. Ensure high contrast for readability and a polished, enterprise-ready appearance.",
  },
  {
    icon: "🌅",
    text: "Warm Sunset",
    primaryColor: "#f97316",
    neutralColor: "#a3a3a3",
    backgroundColor: "#fefefe",
    prompt:
      "Design a warm, inviting theme inspired by golden hour sunsets. Use rich oranges, warm yellows, and soft coral tones. Create a cozy, energetic feeling with gradients that evoke the beauty of a sunset sky. Include complementary warm neutrals and ensure the palette feels optimistic and welcoming.",
  },
  {
    icon: "🌙",
    text: "Minimal Dark",
    primaryColor: "#6366f1",
    neutralColor: "#71717a",
    backgroundColor: "#0f0f23",
    prompt:
      "Create an elegant, minimal dark theme with sophisticated gray tones. Focus on reducing eye strain with carefully balanced contrast ratios. Use deep grays as the foundation with subtle blue or purple undertones. Emphasize clean lines, ample whitespace, and a modern, sleek aesthetic perfect for extended use.",
  },
  {
    icon: "⚡",
    text: "Vibrant Neon",
    primaryColor: "#8b5cf6",
    neutralColor: "#737373",
    backgroundColor: "#0a0a0a",
    prompt:
      "Design an energetic, modern theme with vibrant neon-inspired colors. Use electric purples, bright magentas, and cyber-punk aesthetics. Create high-impact visuals with bold contrasts and glowing effects. Balance the intensity with darker backgrounds to make the neon colors pop while maintaining usability.",
  },
  {
    icon: "🌿",
    text: "Natural Green",
    primaryColor: "#10b981",
    neutralColor: "#78716c",
    backgroundColor: "#fafaf9",
    prompt:
      "Create a calming, nature-inspired theme with organic green tones. Use forest greens, sage, and mint colors that evoke growth, harmony, and sustainability. Include earthy neutrals and natural textures. Design for a peaceful, eco-friendly aesthetic that promotes focus and well-being.",
  },
];

export interface PalettePreset {
  name: string;
  baseColor: string;
  description: string;
}

export const PROMPT_INPUT_PALETTE_PRESETS: PalettePreset[] = [
  { name: "Blue", baseColor: "#3b82f6", description: "Classic blue" },
  { name: "Green", baseColor: "#10b981", description: "Fresh green" },
  { name: "Purple", baseColor: "#8b5cf6", description: "Rich purple" },
  { name: "Orange", baseColor: "#f97316", description: "Vibrant orange" },
  { name: "Pink", baseColor: "#ec4899", description: "Bright pink" },
  { name: "Red", baseColor: "#ef4444", description: "Bold red" },
  { name: "Yellow", baseColor: "#eab308", description: "Sunny yellow" },
  { name: "Teal", baseColor: "#14b8a6", description: "Cool teal" },
  { name: "Gray", baseColor: "#6b7280", description: "Neutral gray" },
];
