import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import type { NextRequest } from "next/server";
import prompt from "./prompt.md";
import { generateThemeTool } from "./tools/generate-theme";
import { getCurrentThemeTool } from "./tools/get-current-theme";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const { messages, currentTheme } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: "Messages array is required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 },
      );
    }

    // Create a dynamic getCurrentTheme tool with access to current theme
    const getCurrentThemeWithContext = {
      ...getCurrentThemeTool,
      execute: async () => {
        if (!currentTheme) {
          return {
            success: false,
            error: "No current theme available",
            timestamp: new Date().toISOString(),
          };
        }

        return {
          success: true,
          theme: currentTheme,
          message: "Current theme retrieved successfully",
          timestamp: new Date().toISOString(),
        };
      },
    };

    // Convert UIMessages from useChat to ModelMessages
    const modelMessages = convertToModelMessages(messages);

    const result = streamText({
      model: openai("gpt-4.1"),
      temperature: 0.7,
      system: prompt,
      messages: modelMessages,
      tools: {
        generateTheme: generateThemeTool,
        getCurrentTheme: getCurrentThemeWithContext,
      },
      stopWhen: stepCountIs(5), // Allow multiple tool calls
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Theme generation error:", error);

    return Response.json(
      { error: "Failed to generate theme" },
      { status: 500 },
    );
  }
}
