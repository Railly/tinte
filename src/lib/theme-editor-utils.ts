import {
  type BaseVarToken,
  DEFAULT_BASE,
  DEFAULT_FONTS,
  type FontToken,
  NON_COLOR_GROUPS,
  TOKEN_GROUPS,
} from "@/types/shadcn";

export interface TokenGroup {
  label: string;
  tokens: Array<[string, string]>;
  type: "color" | "fonts" | "shadow" | "shadow-properties" | "base";
  skeleton?: boolean;
}

export const createSkeletonGroups = (): TokenGroup[] => {
  const groups: TokenGroup[] = [];

  TOKEN_GROUPS.forEach((group) => {
    groups.push({
      label: group.label,
      tokens: group.keys.map((key) => [key, "#888888"] as [string, string]),
      type: "color",
      skeleton: true,
    });
  });

  Object.entries(NON_COLOR_GROUPS).forEach(([groupName, groupData]) => {
    if (Array.isArray(groupData)) {
      if (groupName === "Shadows") {
        groups.push({
          label: groupName,
          tokens: [["shadow-properties", "shadow-editor"]],
          type: "shadow-properties",
          skeleton: true,
        });
      } else if (groupName === "Fonts") {
        groups.push({
          label: groupName,
          tokens: groupData.map((key) => [key, "Loading..."]),
          type: "fonts",
          skeleton: true,
        });
      }
    } else if (groupData.editable) {
      groups.push({
        label: groupName,
        tokens: groupData.editable.map((key) => [key, "loading"]),
        type: "base",
        skeleton: true,
      });
    }
  });

  return groups;
};

// Organize real tokens into groups
export const organizeRealTokens = (
  currentTokens: Record<string, string>,
): TokenGroup[] => {
  const groups: TokenGroup[] = [];

  // Color token groups
  TOKEN_GROUPS.forEach((group) => {
    const tokens = group.keys
      .map((key) => [key, currentTokens[key]] as [string, string])
      .filter(
        ([_, value]) => typeof value === "string" && value.startsWith("#"),
      );

    if (tokens.length > 0) {
      groups.push({
        label: group.label,
        tokens,
        type: "color",
      });
    }
  });

  // Non-color token groups
  Object.entries(NON_COLOR_GROUPS).forEach(([groupName, groupData]) => {
    if (Array.isArray(groupData)) {
      if (groupName === "Shadows") {
        const hasValidShadowData = groupData.some(
          (key) =>
            currentTokens[key] &&
            typeof currentTokens[key] === "string" &&
            currentTokens[key].trim().length > 0,
        );

        if (hasValidShadowData) {
          groups.push({
            label: groupName,
            tokens: [["shadow-properties", "shadow-editor"]],
            type: "shadow-properties",
          });
        }
      } else {
        const tokens = groupData
          .map((key) => {
            let value = currentTokens[key];
            if (!value || typeof value !== "string") {
              if (groupName === "Fonts") {
                value = DEFAULT_FONTS[key as FontToken] || "";
              }
            }
            return [key, value] as [string, string];
          })
          .filter(
            ([_, value]) =>
              typeof value === "string" && value.trim().length > 0,
          );

        if (tokens.length > 0) {
          groups.push({
            label: groupName,
            tokens,
            type: groupName === "Fonts" ? "fonts" : "base",
          });
        }
      }
    } else if (groupData.editable) {
      const tokens = groupData.editable
        .map((key) => {
          let value = currentTokens[key];
          if (!value || typeof value !== "string") {
            value = DEFAULT_BASE[key as BaseVarToken] || "";
          }
          return [key, value] as [string, string];
        })
        .filter(
          ([_, value]) => typeof value === "string" && value.trim().length > 0,
        );

      if (tokens.length > 0) {
        groups.push({
          label: groupName,
          tokens,
          type: "base",
        });
      }
    }
  });

  return groups;
};
