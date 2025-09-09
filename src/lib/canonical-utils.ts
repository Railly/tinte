import type { TinteBlock } from "@/types/tinte";

export interface CanonicalGroup {
  label: string;
  keys: (keyof TinteBlock)[];
  skeleton?: boolean;
}

export const COLOR_GROUPS: CanonicalGroup[] = [
  {
    label: "Background",
    keys: ["bg", "bg_2"] as (keyof TinteBlock)[],
  },
  {
    label: "Interface",
    keys: ["ui", "ui_2", "ui_3"] as (keyof TinteBlock)[],
  },
  {
    label: "Text",
    keys: ["tx_3", "tx_2", "tx"] as (keyof TinteBlock)[],
  },
  {
    label: "Accents",
    keys: ["pr", "sc", "ac_1", "ac_2", "ac_3"] as (keyof TinteBlock)[],
  },
] as const;

// Initialize all groups as open to prevent flash
export const createInitialCanonicalGroups = (): Record<string, boolean> => {
  const initialState: Record<string, boolean> = {};
  COLOR_GROUPS.forEach((group) => {
    initialState[group.label] = true;
  });
  return initialState;
};

// Check if we have valid tinte colors loaded
export const hasValidTinteColors = (
  colors: TinteBlock | undefined,
): boolean => {
  if (!colors) return false;
  return COLOR_GROUPS.some((group) =>
    group.keys.some(
      (key) =>
        colors[key] &&
        typeof colors[key] === "string" &&
        colors[key].startsWith("#"),
    ),
  );
};

// Create skeleton structure for canonical colors
export const createCanonicalSkeletons = (): CanonicalGroup[] => {
  return COLOR_GROUPS.map((group) => ({
    ...group,
    skeleton: true,
  }));
};
