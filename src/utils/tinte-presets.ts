// Extract themes for theme showcase
export function extractTinteThemeData(isDark = false) {
  return tintePresets.map((preset, index) => {
    const colorData = isDark ? preset.dark : preset.light;
    return {
      id: `tinte-${index + 1}`,
      name: preset.name,
      colors: {
        primary: colorData.primary,
        secondary: colorData.secondary,
        accent: colorData.accent,
        background: colorData.background,
        foreground: colorData.text,
      },
      createdAt: '2024-01-20',
      rawTheme: {
        light: preset.light,
        dark: preset.dark
      }
    };
  });
}

export const tintePresets = [
  {
    name: "Ocean Wave",
    light: {
      text: "#0F172A",
      primary: "#0EA5E9",
      secondary: "#0284C7",
      accent: "#06B6D4",
      background: "#F8FAFC",
      interface: "#E2E8F0",
      interface_2: "#CBD5E1",
      interface_3: "#94A3B8"
    },
    dark: {
      text: "#F8FAFC",
      primary: "#38BDF8",
      secondary: "#0EA5E9",
      accent: "#22D3EE",
      background: "#0F172A",
      interface: "#1E293B",
      interface_2: "#334155",
      interface_3: "#475569"
    }
  },
  {
    name: "Forest Green",
    light: {
      text: "#1F2937",
      primary: "#10B981",
      secondary: "#059669",
      accent: "#34D399",
      background: "#F9FAFB",
      interface: "#F3F4F6",
      interface_2: "#E5E7EB",
      interface_3: "#D1D5DB"
    },
    dark: {
      text: "#F9FAFB",
      primary: "#34D399",
      secondary: "#10B981",
      accent: "#6EE7B7",
      background: "#111827",
      interface: "#1F2937",
      interface_2: "#374151",
      interface_3: "#4B5563"
    }
  },
  {
    name: "Purple Magic",
    light: {
      text: "#1E1B4B",
      primary: "#8B5CF6",
      secondary: "#7C3AED",
      accent: "#A78BFA",
      background: "#FAF5FF",
      interface: "#F3E8FF",
      interface_2: "#E9D5FF",
      interface_3: "#DDD6FE"
    },
    dark: {
      text: "#FAF5FF",
      primary: "#A78BFA",
      secondary: "#8B5CF6",
      accent: "#C4B5FD",
      background: "#1E1B4B",
      interface: "#312E81",
      interface_2: "#3730A3",
      interface_3: "#4338CA"
    }
  },
  {
    name: "Sunset Orange",
    light: {
      text: "#1C1917",
      primary: "#F97316",
      secondary: "#EA580C",
      accent: "#FB923C",
      background: "#FFFBEB",
      interface: "#FEF3C7",
      interface_2: "#FDE68A",
      interface_3: "#FCD34D"
    },
    dark: {
      text: "#FFFBEB",
      primary: "#FB923C",
      secondary: "#F97316",
      accent: "#FDBA74",
      background: "#1C1917",
      interface: "#292524",
      interface_2: "#44403C",
      interface_3: "#57534E"
    }
  },
  {
    name: "Rose Pink",
    light: {
      text: "#881337",
      primary: "#EC4899",
      secondary: "#DB2777",
      accent: "#F472B6",
      background: "#FDF2F8",
      interface: "#FCE7F3",
      interface_2: "#FBCFE8",
      interface_3: "#F9A8D4"
    },
    dark: {
      text: "#FDF2F8",
      primary: "#F472B6",
      secondary: "#EC4899",
      accent: "#F9A8D4",
      background: "#881337",
      interface: "#9F1239",
      interface_2: "#BE185D",
      interface_3: "#DB2777"
    }
  },
  {
    name: "Steel Gray",
    light: {
      text: "#111827",
      primary: "#6B7280",
      secondary: "#4B5563",
      accent: "#9CA3AF",
      background: "#F9FAFB",
      interface: "#F3F4F6",
      interface_2: "#E5E7EB",
      interface_3: "#D1D5DB"
    },
    dark: {
      text: "#F9FAFB",
      primary: "#9CA3AF",
      secondary: "#6B7280",
      accent: "#D1D5DB",
      background: "#111827",
      interface: "#1F2937",
      interface_2: "#374151",
      interface_3: "#4B5563"
    }
  },
  {
    name: "Electric Blue",
    light: {
      text: "#1E3A8A",
      primary: "#3B82F6",
      secondary: "#2563EB",
      accent: "#60A5FA",
      background: "#EFF6FF",
      interface: "#DBEAFE",
      interface_2: "#BFDBFE",
      interface_3: "#93C5FD"
    },
    dark: {
      text: "#EFF6FF",
      primary: "#60A5FA",
      secondary: "#3B82F6",
      accent: "#93C5FD",
      background: "#1E3A8A",
      interface: "#1E40AF",
      interface_2: "#2563EB",
      interface_3: "#3B82F6"
    }
  },
  {
    name: "Emerald Shine",
    light: {
      text: "#064E3B",
      primary: "#059669",
      secondary: "#047857",
      accent: "#10B981",
      background: "#ECFDF5",
      interface: "#D1FAE5",
      interface_2: "#A7F3D0",
      interface_3: "#6EE7B7"
    },
    dark: {
      text: "#ECFDF5",
      primary: "#10B981",
      secondary: "#059669",
      accent: "#34D399",
      background: "#064E3B",
      interface: "#065F46",
      interface_2: "#047857",
      interface_3: "#059669"
    }
  },
  {
    name: "Cherry Red",
    light: {
      text: "#7F1D1D",
      primary: "#DC2626",
      secondary: "#B91C1C",
      accent: "#EF4444",
      background: "#FEF2F2",
      interface: "#FEE2E2",
      interface_2: "#FECACA",
      interface_3: "#FCA5A5"
    },
    dark: {
      text: "#FEF2F2",
      primary: "#EF4444",
      secondary: "#DC2626",
      accent: "#F87171",
      background: "#7F1D1D",
      interface: "#991B1B",
      interface_2: "#B91C1C",
      interface_3: "#DC2626"
    }
  },
  {
    name: "Golden Hour",
    light: {
      text: "#78350F",
      primary: "#D97706",
      secondary: "#B45309",
      accent: "#F59E0B",
      background: "#FFFBEB",
      interface: "#FEF3C7",
      interface_2: "#FDE68A",
      interface_3: "#FCD34D"
    },
    dark: {
      text: "#FFFBEB",
      primary: "#F59E0B",
      secondary: "#D97706",
      accent: "#FBBF24",
      background: "#78350F",
      interface: "#92400E",
      interface_2: "#B45309",
      interface_3: "#D97706"
    }
  },
  {
    name: "Lavender Dream",
    light: {
      text: "#581C87",
      primary: "#9333EA",
      secondary: "#7C3AED",
      accent: "#A855F7",
      background: "#FAF5FF",
      interface: "#F3E8FF",
      interface_2: "#E9D5FF",
      interface_3: "#DDD6FE"
    },
    dark: {
      text: "#FAF5FF",
      primary: "#A855F7",
      secondary: "#9333EA",
      accent: "#C084FC",
      background: "#581C87",
      interface: "#6B21A8",
      interface_2: "#7C3AED",
      interface_3: "#9333EA"
    }
  },
  {
    name: "Mint Fresh",
    light: {
      text: "#134E4A",
      primary: "#14B8A6",
      secondary: "#0D9488",
      accent: "#2DD4BF",
      background: "#F0FDFA",
      interface: "#CCFBF1",
      interface_2: "#99F6E4",
      interface_3: "#5EEAD4"
    },
    dark: {
      text: "#F0FDFA",
      primary: "#2DD4BF",
      secondary: "#14B8A6",
      accent: "#5EEAD4",
      background: "#134E4A",
      interface: "#115E59",
      interface_2: "#0D9488",
      interface_3: "#14B8A6"
    }
  }
];