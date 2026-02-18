import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText } from "ai";
import type { NextRequest } from "next/server";
import prompt from "./prompt.md";

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

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "Google Generative AI API key is not configured" },
        { status: 500 },
      );
    }

    const result = streamText({
      model: google("gemini-2.5-flash-image-preview"),
      temperature: 0.7,
      providerOptions: {
        google: { responseModalities: ["TEXT", "IMAGE"] },
      },
      system: prompt,
      messages: convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Nano Banana chat error:", error);

    return Response.json(
      { error: "Failed to process chat request" },
      { status: 500 },
    );
  }
}
