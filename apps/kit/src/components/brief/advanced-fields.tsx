"use client";

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { generateUploadDropzone } from "@uploadthing/react";
import { useState } from "react";
import { type HslColor, HslColorPicker } from "react-colorful";

import type { UploadRouter } from "@/app/api/uploadthing/core";

const UploadDropzone = generateUploadDropzone<UploadRouter>();

const vibeOptions = [
  "bold",
  "playful",
  "minimalist",
  "premium",
  "retro",
  "futuristic",
  "organic",
  "geometric",
] as const;

const initialColors: HslColor[] = [
  { h: 72, s: 100, l: 68 },
  { h: 24, s: 76, l: 58 },
  { h: 205, s: 62, l: 55 },
];

function hslToString(color: HslColor) {
  return `hsl(${Math.round(color.h)} ${Math.round(color.s)}% ${Math.round(
    color.l,
  )}%)`;
}

function hslToHex(color: HslColor) {
  const h = color.h / 360;
  const s = color.s / 100;
  const l = color.l / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h * 12) % 12;
    const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * c)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function AdvancedFields() {
  const [vibe, setVibe] = useState<string[]>([]);
  const [colors, setColors] = useState(initialColors);
  const [refImages, setRefImages] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState("");
  const [activeColor, setActiveColor] = useState(0);

  return (
    <div className="grid gap-6">
      <fieldset className="grid gap-2.5">
        <legend className="font-medium text-[#a7a096] text-xs uppercase tracking-[0.14em]">
          Vibe
        </legend>
        <ToggleGroup.Root
          className="flex flex-wrap gap-1.5"
          onValueChange={setVibe}
          type="multiple"
          value={vibe}
        >
          {vibeOptions.map((option) => (
            <ToggleGroup.Item
              className="h-7 rounded border border-[#2b2925] px-2.5 text-[#a7a096] text-xs capitalize transition-colors hover:border-[#3a372f] hover:text-[#f4f1e8] data-[state=on]:border-[#d8ff5f] data-[state=on]:bg-[#d8ff5f]/15 data-[state=on]:text-[#d8ff5f]"
              key={option}
              value={option}
            >
              {option}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
        {vibe.map((tag) => (
          <input key={tag} name="advanced.vibe" type="hidden" value={tag} />
        ))}
      </fieldset>

      <fieldset className="grid gap-2.5">
        <legend className="font-medium text-[#a7a096] text-xs uppercase tracking-[0.14em]">
          Color hints
        </legend>
        <div className="grid gap-3 md:grid-cols-[180px_1fr]">
          <div className="grid gap-2">
            {colors.map((color, index) => {
              const hex = hslToHex(color);
              return (
                <button
                  className={`flex items-center justify-between gap-2 rounded border px-2.5 py-1.5 text-left text-xs transition-colors ${
                    activeColor === index
                      ? "border-[#d8ff5f] bg-[#d8ff5f]/5"
                      : "border-[#2b2925] hover:border-[#3a372f]"
                  }`}
                  key={index}
                  onClick={() => setActiveColor(index)}
                  type="button"
                >
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="h-4 w-4 rounded"
                      style={{ backgroundColor: hex }}
                    />
                    <span className="text-[#a7a096]">Color {index + 1}</span>
                  </span>
                  <span className="font-mono text-[#5f5a4e] text-[10px]">
                    {hex}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="rounded border border-[#2b2925] bg-[#0c0c0b] p-3">
            <HslColorPicker
              color={colors[activeColor]}
              onChange={(nextColor) =>
                setColors((current) =>
                  current.map((item, itemIndex) =>
                    itemIndex === activeColor ? nextColor : item,
                  ),
                )
              }
            />
          </div>
        </div>
        {colors.map((color, index) => (
          <input
            key={index}
            name="advanced.colors"
            type="hidden"
            value={hslToString(color)}
          />
        ))}
      </fieldset>

      <fieldset className="grid gap-2.5">
        <legend className="font-medium text-[#a7a096] text-xs uppercase tracking-[0.14em]">
          Reference images
        </legend>
        <UploadDropzone
          appearance={{
            button:
              "bg-[#d8ff5f] text-[#0c0c0b] h-8 rounded px-3 font-medium text-xs",
            container:
              "border border-dashed border-[#2b2925] bg-[#0c0c0b] rounded p-4",
            label: "text-[#a7a096] text-xs",
            allowedContent: "text-[#5f5a4e] text-[10px]",
            uploadIcon: "text-[#3a372f]",
          }}
          config={{ mode: "auto" }}
          content={{
            label: "Drop up to 3 reference images",
            allowedContent: "PNG, JPG up to 4MB each",
          }}
          endpoint="refImage"
          onClientUploadComplete={(files) => {
            setUploadError("");
            setRefImages((current) =>
              [...current, ...files.map((file) => file.url)].slice(0, 3),
            );
          }}
          onUploadError={(error) => setUploadError(error.message)}
        />
        {uploadError ? (
          <p className="text-[#ff9b9b] text-xs">{uploadError}</p>
        ) : null}
        {refImages.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {refImages.map((url) => (
              <img
                alt=""
                className="aspect-square rounded border border-[#2b2925] object-cover"
                key={url}
                src={url}
              />
            ))}
          </div>
        ) : null}
        {refImages.map((url) => (
          <input
            key={url}
            name="advanced.refImages"
            type="hidden"
            value={url}
          />
        ))}
      </fieldset>
    </div>
  );
}
