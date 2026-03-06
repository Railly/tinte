import { tool } from "ai";
import { z } from "zod/v4";

export const getCurrentThemeTool = tool({
  description:
    "Get the current active theme. In this chat context, no theme is loaded yet. Ask the user to describe their desired theme, or use generateTheme to create one from scratch.",
  inputSchema: z.object({}) as any,
  execute: async () => {
    return {
      success: true,
      message:
        "No theme context available in this session. Ask the user to describe their current theme or preferences, or use generateTheme to create a new one.",
      theme: null,
      timestamp: new Date().toISOString(),
    };
  },
});
