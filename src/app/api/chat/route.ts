import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText } from "ai";
import type { NextRequest } from "next/server";
import prompt from './prompt.md';
import { generateThemeTool } from './tools/generate-theme';

export const maxDuration = 30;


export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

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

    const result = streamText({
      model: openai("gpt-4.1"),
      temperature: 0.7,
      system: prompt,
      messages: convertToModelMessages(messages),
      tools: {
        generateTheme: generateThemeTool,
      },
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
