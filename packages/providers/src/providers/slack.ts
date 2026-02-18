import { SlackPreview } from "@/components/preview/slack/slack-preview";
import { SlackIcon } from "@/components/shared/icons";
import type { TinteTheme } from "@tinte/core";
import { createPolineColorMapping, getThemeName } from "./poline-base";
import type { PreviewableProvider, ProviderOutput } from "./types";

export interface SlackTheme {
  // Sidebar colors
  column_bg: string; // Sidebar background
  menu_bg: string; // Active item and hover background
  active_item: string; // Active item background
  active_item_text: string; // Active item text
  hover_item: string; // Hover item background
  text_color: string; // Primary text color
  active_presence: string; // Online indicator
  mention_badge: string; // Mention badge background

  // Top navigation bar
  top_nav_bg: string; // Top navigation background
  top_nav_text: string; // Top navigation text

  // Message area
  accent_color: string; // Links and accent elements
  link_color: string; // Link text color
}

function generateSlackTheme(
  theme: TinteTheme,
  mode: "light" | "dark",
): SlackTheme {
  const block = theme[mode];
  const colorMapping = createPolineColorMapping(block);

  return {
    // Sidebar colors
    column_bg: colorMapping.bg2, // Sidebar background
    menu_bg: colorMapping.bg, // Menu background
    active_item: colorMapping.accent, // Active item background (accent color)
    active_item_text: colorMapping.bg, // Active item text (contrasts with accent)
    hover_item: colorMapping.ui2, // Hover item background
    text_color: colorMapping.tx, // Primary text color
    active_presence: colorMapping.green, // Online indicator
    mention_badge: colorMapping.red, // Mention badge

    // Top navigation bar
    top_nav_bg: colorMapping.bg, // Top nav background
    top_nav_text: colorMapping.tx, // Top nav text

    // Message area
    accent_color: colorMapping.accent, // Links and accent elements
    link_color: colorMapping.accent, // Link text color (same as accent)
  };
}

export const slackProvider: PreviewableProvider<{
  light: SlackTheme;
  dark: SlackTheme;
}> = {
  metadata: {
    id: "slack",
    name: "Slack",
    description: "Team collaboration and messaging platform",
    category: "other",
    tags: ["communication", "messaging", "collaboration", "workspace"],
    icon: SlackIcon,
    website: "https://slack.com/",
    documentation:
      "https://slack.com/help/articles/205166337-Change-your-Slack-theme",
  },

  fileExtension: "txt",
  mimeType: "text/plain",

  convert: (theme: TinteTheme) => ({
    light: generateSlackTheme(theme, "light"),
    dark: generateSlackTheme(theme, "dark"),
  }),

  export: (theme: TinteTheme, filename?: string): ProviderOutput => {
    const converted = slackProvider.convert(theme);
    const themeName = filename || getThemeName("tinte-theme");

    const slackTheme = converted.dark;

    const slackColorString = [
      slackTheme.column_bg, // 1. Sidebar background
      slackTheme.menu_bg, // 2. Menu background
      slackTheme.active_item, // 3. Active item background
      slackTheme.active_item_text, // 4. Active item text
      slackTheme.hover_item, // 5. Hover item background
      slackTheme.text_color, // 6. Text color
      slackTheme.active_presence, // 7. Active presence indicator
      slackTheme.mention_badge, // 8. Mention badge
      slackTheme.top_nav_bg, // 9. Top navigation background
      slackTheme.top_nav_text, // 10. Top navigation text
    ].join(",");

    return {
      content: slackColorString,
      filename: `${themeName}-slack.txt`,
      mimeType: "text/plain",
    };
  },

  validate: (output: { light: SlackTheme; dark: SlackTheme }) => {
    const validateTheme = (theme: SlackTheme) =>
      !!(
        theme.column_bg &&
        theme.menu_bg &&
        theme.active_item &&
        theme.active_item_text &&
        theme.hover_item &&
        theme.text_color &&
        theme.active_presence &&
        theme.mention_badge &&
        theme.top_nav_bg &&
        theme.top_nav_text &&
        theme.accent_color &&
        theme.link_color
      );

    return validateTheme(output.light) && validateTheme(output.dark);
  },

  preview: {
    component: SlackPreview,
  },
};
