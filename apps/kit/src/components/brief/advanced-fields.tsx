"use client";

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { generateUploadDropzone } from "@uploadthing/react";
import { useEffect, useRef, useState } from "react";
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

function FieldRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2 border-[var(--color-ui)] border-b py-3 last:border-b-0 sm:grid-cols-[100px_1fr] sm:gap-4 sm:py-4">
      <div className="grid gap-0.5">
        <span
          className="font-mono text-[10px] uppercase tracking-[0.16em]"
          style={{ color: "var(--color-tx)" }}
        >
          {label}
        </span>
        {hint ? (
          <span
            className="text-[11px] leading-tight"
            style={{ color: "var(--color-tx-3)" }}
          >
            {hint}
          </span>
        ) : null}
      </div>
      <div>{children}</div>
    </div>
  );
}

export function AdvancedFields() {
  const [vibe, setVibe] = useState<string[]>([]);
  const [colors, setColors] = useState(initialColors);
  const [refImages, setRefImages] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState("");
  const [editingColor, setEditingColor] = useState<number | null>(null);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editingColor === null) return;
    function onClick(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setEditingColor(null);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setEditingColor(null);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [editingColor]);

  return (
    <div className="grid">
      <FieldRow hint="Personality" label="Vibe">
        <ToggleGroup.Root
          className="-m-0.5 flex flex-wrap"
          onValueChange={setVibe}
          type="multiple"
          value={vibe}
        >
          {vibeOptions.map((option) => {
            const active = vibe.includes(option);
            return (
              <ToggleGroup.Item
                className="m-0.5 h-7 rounded-full border px-3 text-[12px] capitalize transition-colors"
                key={option}
                style={{
                  borderColor: active
                    ? "var(--color-tx)"
                    : "var(--color-ui)",
                  background: active
                    ? "var(--color-tx)"
                    : "var(--color-bg)",
                  color: active ? "var(--color-bg)" : "var(--color-tx-2)",
                }}
                value={option}
              >
                {option}
              </ToggleGroup.Item>
            );
          })}
        </ToggleGroup.Root>
        {vibe.map((tag) => (
          <input key={tag} name="advanced.vibe" type="hidden" value={tag} />
        ))}
      </FieldRow>

      <FieldRow hint="Up to 3" label="Palette">
        <div className="grid gap-2" ref={pickerRef}>
          <div className="flex flex-wrap items-center gap-1.5">
            {colors.map((color, index) => {
              const hex = hslToHex(color);
              const isOpen = editingColor === index;
              return (
                <div className="relative" key={index}>
                  <button
                    aria-expanded={isOpen}
                    className="flex h-7 items-center gap-1.5 rounded-full border pr-2.5 pl-1 transition-colors"
                    onClick={() =>
                      setEditingColor((current) =>
                        current === index ? null : index,
                      )
                    }
                    style={{
                      borderColor: isOpen
                        ? "var(--color-tx)"
                        : "var(--color-ui)",
                      background: "var(--color-bg)",
                    }}
                    type="button"
                  >
                    <span
                      aria-hidden="true"
                      className="h-5 w-5 rounded-full"
                      style={{
                        backgroundColor: hex,
                        border: "1px solid var(--color-ui)",
                      }}
                    />
                    <span
                      className="font-mono text-[11px]"
                      style={{ color: "var(--color-tx-2)" }}
                    >
                      {hex}
                    </span>
                  </button>
                  {isOpen ? (
                    <div
                      className="absolute top-full left-0 z-20 mt-2 rounded-md border p-2 shadow-xl"
                      style={{
                        borderColor: "var(--color-ui)",
                        background: "var(--color-bg)",
                      }}
                    >
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
                  ) : null}
                </div>
              );
            })}
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
      </FieldRow>

      <FieldRow hint="PNG · JPG · 4MB" label="References">
        <div className="grid gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {refImages.map((url) => (
              <div
                className="group relative h-12 w-12 overflow-hidden rounded border"
                key={url}
                style={{ borderColor: "var(--color-ui)" }}
              >
                <img
                  alt=""
                  className="h-full w-full object-cover"
                  src={url}
                />
                <button
                  aria-label="Remove"
                  className="absolute inset-0 grid place-items-center opacity-0 transition-opacity hover:opacity-100"
                  onClick={() =>
                    setRefImages((current) =>
                      current.filter((value) => value !== url),
                    )
                  }
                  style={{
                    background: "color-mix(in oklab, var(--color-bg) 85%, transparent)",
                    color: "var(--color-ac-1)",
                    fontSize: "10px",
                  }}
                  type="button"
                >
                  Remove
                </button>
              </div>
            ))}
            {refImages.length < 3 ? (
              <UploadDropzone
                appearance={{
                  button: "hidden",
                  container: "ut-dropzone-inline",
                  label: "ut-dropzone-label",
                  allowedContent: "hidden",
                  uploadIcon: "ut-dropzone-icon",
                }}
                config={{ mode: "auto" }}
                content={{
                  label: `+ Upload (${3 - refImages.length} left)`,
                  allowedContent: "",
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
            ) : null}
          </div>
          {uploadError ? (
            <p
              className="text-[11px]"
              style={{ color: "var(--color-ac-1)" }}
            >
              {uploadError}
            </p>
          ) : null}
          {refImages.map((url) => (
            <input
              key={url}
              name="advanced.refImages"
              type="hidden"
              value={url}
            />
          ))}
        </div>
      </FieldRow>
    </div>
  );
}
