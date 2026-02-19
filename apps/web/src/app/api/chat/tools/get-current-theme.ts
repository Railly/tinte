import { tool } from "ai";
import { z } from "zod/v4";

export const getCurrentThemeTool = tool({
  description:
    "Get the current active theme colors, fonts, radius, and shadows. Use this before making theme modifications to understand the current state.",
  inputSchema: z.object({}) as any,
  execute: async () => {
    return {
      success: true,
      message: "Current theme retrieved successfully",
      timestamp: new Date().toISOString(),
    };
  },
});
