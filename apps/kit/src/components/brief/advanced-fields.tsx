"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
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

export function AdvancedFields() {
  const [vibe, setVibe] = useState<string[]>([]);
  const [colors, setColors] = useState(initialColors);
  const [refImages, setRefImages] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState("");

  return (
    <Collapsible.Root className="grid gap-4 rounded-md border border-[#2b2925] bg-[#11110f] p-4">
      <Collapsible.Trigger className="flex h-10 items-center justify-between rounded-md border border-[#3a372f] px-3 font-medium text-sm">
        <span>Advanced</span>
        <span className="text-[#a7a096]">(optional)</span>
      </Collapsible.Trigger>
      <Collapsible.Content className="grid gap-5">
        <fieldset className="grid gap-3">
          <legend className="font-medium text-sm">Vibe</legend>
          <ToggleGroup.Root
            className="flex flex-wrap gap-2"
            onValueChange={setVibe}
            type="multiple"
            value={vibe}
          >
            {vibeOptions.map((option) => (
              <ToggleGroup.Item
                className="h-9 rounded-md border border-[#3a372f] px-3 text-[#d6d0c7] text-sm capitalize data-[state=on]:border-[#d8ff5f] data-[state=on]:bg-[#d8ff5f] data-[state=on]:text-[#10110a]"
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
        <fieldset className="grid gap-3">
          <legend className="font-medium text-sm">Color hints</legend>
          <div className="grid gap-4 md:grid-cols-3">
            {colors.map((color, index) => {
              const value = hslToString(color);
              return (
                <label className="grid gap-2" key={index}>
                  <span className="text-[#a7a096] text-xs">
                    Color {index + 1}
                  </span>
                  <div className="rounded-md border border-[#2b2925] bg-[#0c0c0b] p-3">
                    <HslColorPicker
                      color={color}
                      onChange={(nextColor) =>
                        setColors((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index ? nextColor : item,
                          ),
                        )
                      }
                    />
                  </div>
                  <input
                    className="h-10 rounded-md border border-[#3a372f] bg-[#0c0c0b] px-3 text-sm outline-none focus:border-[#d8ff5f]"
                    name="advanced.colors"
                    readOnly
                    value={value}
                  />
                </label>
              );
            })}
          </div>
        </fieldset>
        <fieldset className="grid gap-3">
          <legend className="font-medium text-sm">Reference images</legend>
          <UploadDropzone
            appearance={{
              button:
                "bg-[#d8ff5f] text-[#10110a] h-10 rounded-md px-4 font-medium text-sm",
              container:
                "border-[#3a372f] bg-[#0c0c0b] min-h-44 rounded-md p-4",
              label: "text-[#f4f1e8] text-sm",
              allowedContent: "text-[#a7a096] text-xs",
            }}
            config={{ mode: "auto" }}
            content={{
              label: "Drop up to three reference images",
              allowedContent: "Images up to 4MB each",
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
            <p className="text-[#ff7a7a] text-sm">{uploadError}</p>
          ) : null}
          {refImages.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {refImages.map((url) => (
                <img
                  alt=""
                  className="aspect-square rounded-md border border-[#2b2925] object-cover"
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
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
