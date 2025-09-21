export const ROADMAP_SECTIONS = {
  "Being Worked On 🔥": [
    {
      id: "1",
      title: "AI Theme Generator",
      description:
        "Generate beautiful themes using AI prompts with advanced color theory",
      status: "in-progress" as const,
      category: "Core",
    },
    {
      id: "2",
      title: "shadcn/ui Export",
      description:
        "Export themes directly as shadcn/ui compatible CSS variables",
      status: "in-progress" as const,
      category: "Export",
    },
  ],
  "Planned 📋": [
    {
      id: "3",
      title: "VS Code Theme Export",
      description: "Generate and export complete VS Code editor themes",
      status: "planned" as const,
      category: "Export",
    },
    {
      id: "4",
      title: "Community Marketplace",
      description: "Browse and share themes created by the community",
      status: "planned" as const,
      category: "Social",
    },
    {
      id: "5",
      title: "Real-time Preview",
      description: "Live preview of theme changes across multiple components",
      status: "planned" as const,
      category: "Editor",
    },
    {
      id: "6",
      title: "Figma Integration",
      description: "Import color palettes directly from Figma design files",
      status: "planned" as const,
      category: "Integration",
    },
  ],
  "Completed 🎉": [
    {
      id: "7",
      title: "Color Palette Generation",
      description:
        "Generate harmonious color palettes with accessibility checks",
      status: "completed" as const,
      category: "Core",
    },
    {
      id: "8",
      title: "Theme Browsing",
      description:
        "Browse and preview community themes in grid and table views",
      status: "completed" as const,
      category: "Browse",
    },
  ],
};
