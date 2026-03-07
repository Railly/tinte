export const ROADMAP_SECTIONS = {
  "Being Worked On": [
    {
      id: "1",
      title: "Preset Gallery",
      description:
        "Browse and discover 500+ design system presets with live preview and one-command install",
      status: "in-progress" as const,
      category: "Core",
    },
    {
      id: "2",
      title: "AI Preset Generation",
      description:
        "Describe your brand or aesthetic in natural language and get a complete design system preset",
      status: "in-progress" as const,
      category: "Core",
    },
    {
      id: "3",
      title: "Brand-to-Preset",
      description:
        "Upload your logo or brand assets to automatically extract colors and generate a matching preset",
      status: "in-progress" as const,
      category: "Integration",
    },
  ],
  Planned: [
    {
      id: "4",
      title: "Tinte CLI",
      description:
        "bunx tinte init wrapping shadcn CLI for preset management, publishing, and browsing",
      status: "planned" as const,
      category: "Core",
    },
    {
      id: "5",
      title: "Preset Analytics",
      description:
        "Track installs, views, and forks for your published presets",
      status: "planned" as const,
      category: "Social",
    },
    {
      id: "6",
      title: "Team Design Systems",
      description:
        "Shared presets with version control, branching, and collaborative editing",
      status: "planned" as const,
      category: "Social",
    },
    {
      id: "7",
      title: "Website-to-Preset",
      description:
        "Scrape any website's CSS variables and convert them into a Tinte preset",
      status: "planned" as const,
      category: "Integration",
    },
  ],
  Completed: [
    {
      id: "8",
      title: "Agent Skill",
      description:
        "npx skills add Railly/tinte — AI agents can browse, install, and preview Tinte presets",
      status: "completed" as const,
      category: "Integration",
    },
    {
      id: "9",
      title: "Preset Pack API",
      description:
        "GET /api/preset/{slug}?type=pack returns base + fonts + install commands in one payload",
      status: "completed" as const,
      category: "Core",
    },
    {
      id: "10",
      title: "Registry Font API",
      description:
        "Distribute fonts as registry:font items via /api/preset/{slug}/font",
      status: "completed" as const,
      category: "Export",
    },
    {
      id: "11",
      title: "Preset Distribution API",
      description:
        "Serve presets as registry:base items via /api/preset/{slug} for shadcn CLI v4",
      status: "completed" as const,
      category: "Core",
    },
    {
      id: "12",
      title: "AI Theme Generator",
      description:
        "Generate presets using AI prompts with advanced color theory and OKLCH color space",
      status: "completed" as const,
      category: "Core",
    },
    {
      id: "13",
      title: "Multi-Format Export",
      description:
        "Export to shadcn/ui, VS Code, Shiki, terminals, and design systems (19 formats)",
      status: "completed" as const,
      category: "Export",
    },
    {
      id: "14",
      title: "Live Preview System",
      description:
        "Real-time preview across multiple providers with Monaco Editor and Shiki",
      status: "completed" as const,
      category: "Editor",
    },
    {
      id: "15",
      title: "Community Marketplace",
      description:
        "Browse, share, and discover 500+ community presets with search and filtering",
      status: "completed" as const,
      category: "Social",
    },
    {
      id: "16",
      title: "Professional Workbench",
      description:
        "Advanced preset editor with canonical editing, provider overrides, and AI assistance",
      status: "completed" as const,
      category: "Editor",
    },
  ],
};
