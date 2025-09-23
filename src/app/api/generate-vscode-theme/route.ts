import { NextRequest, NextResponse } from "next/server";

const NETLIFY_FUNCTION_URL = "/.netlify/functions/generate-vscode-theme";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    const response = await fetch(NETLIFY_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": request.headers.get("origin") || "http://localhost:3000",
      },
      body,
    });

    if (!response.ok) {
      throw new Error(`Netlify function returned ${response.status}`);
    }

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/octet-stream")) {
      const buffer = await response.arrayBuffer();
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Disposition": response.headers.get("content-disposition") || "",
        },
      });
    } else {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }
  } catch (error) {
    console.error("Error proxying to Netlify function:", error);
    return NextResponse.json(
      { error: "Failed to generate VS Code theme" },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}