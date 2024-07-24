/* eslint-disable @next/next/no-img-element */
import fs from "fs/promises";
import path from "path";
import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { getUnprotectedThemeById } from "@/lib/api";
import { ThemeConfig } from "@/lib/core/types";

const geistSansPath = path.join(
  process.cwd(),
  "public/fonts/Geist-Regular.ttf"
);
const geistSansBoldPath = path.join(
  process.cwd(),
  "public/fonts/Geist-Bold.ttf"
);
const geistMonoPath = path.join(
  process.cwd(),
  "public/fonts/GeistMono-Regular.ttf"
);

const geistSansFont = fs.readFile(geistSansPath);
const geistSansBoldFont = fs.readFile(geistSansBoldPath);
const geistMonoFont = fs.readFile(geistMonoPath);

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const themeId = searchParams.get("id");

  if (!themeId) {
    return new Response("Missing theme ID", { status: 400 });
  }

  try {
    const theme = (await getUnprotectedThemeById(themeId)) as ThemeConfig;

    const [geistSans, geistSansBold, geistMono] = await Promise.all([
      geistSansFont,
      geistSansBoldFont,
      geistMonoFont,
    ]);

    const colorKeys = Object.keys(theme.palette.light).filter(
      (key) =>
        ![
          "id",
          "background",
          "background-2",
          "text",
          "text-2",
          "text-3",
          "interface",
          "interface-2",
          "interface-3",
        ].includes(key)
    );

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "Geist Sans",
            overflow: "hidden",
            position: "relative",
            padding: "60px 0",
          }}
        >
          {/* Diagonal split background */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(152.2deg, ${theme.palette.light.background} 50%, ${theme.palette.dark.background} 50%)`,
            }}
          />

          <h1
            style={{
              fontSize: 72,
              fontWeight: "bold",
              margin: 0,
              padding: 0,
              color: theme.palette.light.text,
              mixBlendMode: "difference",
              zIndex: 10,
              fontFamily: "Geist Sans",
            }}
          >
            {theme.displayName}
          </h1>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              padding: "0 80px",
              zIndex: 10,
            }}
          >
            {/* Light Theme Colors */}
            <div style={{ display: "flex", flexWrap: "wrap", width: "45%" }}>
              {colorKeys.map((key) => (
                <div
                  key={`light-${key}`}
                  style={{
                    width: 64,
                    height: 64,
                    backgroundColor:
                      theme.palette.light[
                        key as keyof typeof theme.palette.light
                      ],
                    borderRadius: 60,
                    margin: 10,
                    border: `2px solid ${theme.palette.light.text}`,
                    boxShadow: `0 0 10px ${theme.palette.light.text}30`,
                  }}
                />
              ))}
            </div>

            {/* Dark Theme Colors */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                width: "45%",
                justifyContent: "flex-end",
              }}
            >
              {colorKeys.map((key) => (
                <div
                  key={`dark-${key}`}
                  style={{
                    width: 64,
                    height: 64,
                    backgroundColor:
                      theme.palette.dark[
                        key as keyof typeof theme.palette.dark
                      ],
                    borderRadius: 60,
                    margin: 10,
                    border: `2px solid ${theme.palette.dark.text}`,
                    boxShadow: `0 0 10px ${theme.palette.dark.text}30`,
                  }}
                />
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: theme.palette.dark.text,
              mixBlendMode: "difference",
              zIndex: 10,
            }}
          >
            {theme.user?.username && (
              <p
                style={{
                  marginBottom: 4,
                  padding: 0,
                  fontSize: 36,
                  fontFamily: "Geist Sans",
                  fontWeight: 700,
                }}
              >
                Created by @{theme.user.username}
              </p>
            )}
            <p
              style={{
                margin: 0,
                padding: 0,
                fontSize: 24,
                color: theme.palette.dark["text-3"],
                fontFamily: "Geist Mono",
              }}
            >
              Generated by tinte.railly.dev
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Geist Sans",
            data: geistSans,
            style: "normal",
            weight: 400,
          },
          {
            name: "Geist Sans",
            data: geistSansBold,
            style: "normal",
            weight: 700,
          },
          {
            name: "Geist Mono",
            data: geistMono,
            style: "normal",
            weight: 400,
          },
        ],
      }
    );
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response("Error generating image", { status: 500 });
  }
}
