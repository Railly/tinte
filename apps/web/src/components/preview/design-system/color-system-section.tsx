"use client";

import type { TinteBlock } from "@tinte/core";

interface ColorSystemSectionProps {
  colors: TinteBlock;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${Math.round(r).toString(16).padStart(2, "0")}${Math.round(g).toString(16).padStart(2, "0")}${Math.round(b).toString(16).padStart(2, "0")}`;
}

function generateColorRamp(
  hex: string,
  steps: number[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
): { step: number; hex: string }[] {
  const rgb = hexToRgb(hex);
  if (!rgb) return steps.map((step) => ({ step, hex }));

  return steps.map((step) => {
    const t = step / 1000;
    const r = rgb.r + (255 - rgb.r) * Math.max(0, 1 - t * 2.5);
    const g = rgb.g + (255 - rgb.g) * Math.max(0, 1 - t * 2.5);
    const b = rgb.b + (255 - rgb.b) * Math.max(0, 1 - t * 2.5);

    const dr = rgb.r * Math.max(0, 1 - (t - 0.4) * 2.5);
    const dg = rgb.g * Math.max(0, 1 - (t - 0.4) * 2.5);
    const db = rgb.b * Math.max(0, 1 - (t - 0.4) * 2.5);

    const finalR = step <= 500 ? r : dr;
    const finalG = step <= 500 ? g : dg;
    const finalB = step <= 500 ? b : db;

    return {
      step,
      hex: rgbToHex(
        Math.max(0, Math.min(255, finalR)),
        Math.max(0, Math.min(255, finalG)),
        Math.max(0, Math.min(255, finalB)),
      ),
    };
  });
}

function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#000000";
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

export function ColorSystemSection({ colors }: ColorSystemSectionProps) {
  const prRamp = generateColorRamp(colors.pr);
  const scRamp = generateColorRamp(colors.sc);

  const backgrounds = [
    {
      label: "Background",
      key: "bg",
      usage: "Page background",
      value: colors.bg,
    },
    {
      label: "Surface",
      key: "bg_2",
      usage: "Cards & panels",
      value: colors.bg_2,
    },
    {
      label: "Elevated",
      key: "ui",
      usage: "Borders & dividers",
      value: colors.ui,
    },
    {
      label: "Overlay",
      key: "ui_2",
      usage: "Hover states",
      value: colors.ui_2,
    },
  ];

  const textColors = [
    { label: "Primary", value: colors.tx, usage: "Main text" },
    { label: "Secondary", value: colors.tx_2, usage: "Body copy" },
    { label: "Tertiary", value: colors.tx_3, usage: "Captions & hints" },
    { label: "Disabled", value: colors.ui_3, usage: "Inactive elements" },
  ];

  const semanticColors = [
    { label: "Success", value: "#22C55E" },
    { label: "Warning", value: "#F59E0B" },
    { label: "Error", value: colors.ac_1 },
    { label: "Info", value: colors.sc },
  ];

  return (
    <div className="space-y-10">
      <div>
        <p
          className="text-xs font-mono uppercase tracking-widest mb-1"
          style={{ color: colors.tx_3 }}
        >
          Backgrounds
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {backgrounds.map((bg) => (
            <div
              key={bg.key}
              className="rounded-lg overflow-hidden border"
              style={{ borderColor: colors.ui }}
            >
              <div className="h-14" style={{ backgroundColor: bg.value }} />
              <div className="p-2" style={{ backgroundColor: colors.bg_2 }}>
                <div
                  className="text-xs font-medium"
                  style={{ color: colors.tx }}
                >
                  {bg.label}
                </div>
                <div
                  className="text-xs font-mono mt-0.5"
                  style={{ color: colors.tx_3 }}
                >
                  {bg.value}
                </div>
                <div className="text-xs mt-0.5" style={{ color: colors.tx_3 }}>
                  {bg.usage}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p
          className="text-xs font-mono uppercase tracking-widest mb-3"
          style={{ color: colors.tx_3 }}
        >
          Text Hierarchy
        </p>
        <div className="space-y-3">
          {textColors.map((t) => (
            <div key={t.label} className="flex items-center gap-4">
              <div
                className="w-4 h-4 rounded-sm flex-shrink-0 border"
                style={{ backgroundColor: t.value, borderColor: colors.ui }}
              />
              <span
                className="text-sm font-medium w-20"
                style={{ color: t.value }}
              >
                {t.label}
              </span>
              <span
                className="text-xs font-mono"
                style={{ color: colors.tx_3 }}
              >
                {t.value}
              </span>
              <span className="text-xs" style={{ color: colors.tx_3 }}>
                {t.usage}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p
          className="text-xs font-mono uppercase tracking-widest mb-3"
          style={{ color: colors.tx_3 }}
        >
          Primary Ramp
        </p>
        <div className="flex rounded-lg overflow-hidden h-10">
          {prRamp.map(({ step, hex }) => (
            <div
              key={step}
              className="flex-1 flex items-center justify-center group relative"
              style={{ backgroundColor: hex }}
              title={`${step}: ${hex}`}
            >
              <span
                className="text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: getContrastColor(hex) }}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
        <div className="flex mt-1">
          {prRamp.map(({ step, hex }) => (
            <div key={step} className="flex-1 text-center">
              <span
                className="text-[9px] font-mono"
                style={{ color: colors.tx_3 }}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p
          className="text-xs font-mono uppercase tracking-widest mb-3"
          style={{ color: colors.tx_3 }}
        >
          Secondary Ramp
        </p>
        <div className="flex rounded-lg overflow-hidden h-10">
          {scRamp.map(({ step, hex }) => (
            <div
              key={step}
              className="flex-1 flex items-center justify-center group relative"
              style={{ backgroundColor: hex }}
              title={`${step}: ${hex}`}
            >
              <span
                className="text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: getContrastColor(hex) }}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
        <div className="flex mt-1">
          {scRamp.map(({ step, hex }) => (
            <div key={step} className="flex-1 text-center">
              <span
                className="text-[9px] font-mono"
                style={{ color: colors.tx_3 }}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p
          className="text-xs font-mono uppercase tracking-widest mb-3"
          style={{ color: colors.tx_3 }}
        >
          Semantic Colors
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {semanticColors.map((s) => (
            <div
              key={s.label}
              className="rounded-lg p-3 border"
              style={{
                backgroundColor: s.value + "18",
                borderColor: s.value + "40",
              }}
            >
              <div
                className="w-6 h-6 rounded-md mb-2"
                style={{ backgroundColor: s.value }}
              />
              <div className="text-xs font-medium" style={{ color: colors.tx }}>
                {s.label}
              </div>
              <div
                className="text-xs font-mono mt-0.5"
                style={{ color: colors.tx_3 }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
