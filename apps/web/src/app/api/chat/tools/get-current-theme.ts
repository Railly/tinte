import { tool } from "ai";
import { z } from "zod";

export const getCurrentThemeTool = tool({
  description:
    "Get the current active theme colors, fonts, radius, and shadows. Use this before making theme modifications to understand the current state.",
  inputSchema: z.object({}),
  execute: async () => {
    // This tool will receive the current theme via the context passed from the client
    // The actual theme data will be injected by the API route
    return {
      success: true,
      message: "Current theme retrieved successfully",
      timestamp: new Date().toISOString(),
    };
  },
});
