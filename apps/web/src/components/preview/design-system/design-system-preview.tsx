"use client";

import type { DesignSystemOutput } from "@tinte/providers";
import { useThemeTokens } from "@/stores/hooks/use-theme-tokens";
import { useThemeStore } from "@/stores/theme";
import { ColorSystemSection } from "./color-system-section";
import { ComponentsSection } from "./components-section";
import { DataVizSection } from "./data-viz-section";
import { FormsSection } from "./forms-section";
import { TypographySection } from "./typography-section";

interface DesignSystemPreviewProps {
  theme: DesignSystemOutput;
  className?: string;
}

const DEFAULT_COLORS = {
  bg: "#ffffff",
  bg_2: "#f8f9fa",
  ui: "#e9ecef",
  ui_2: "#dee2e6",
  ui_3: "#ced4da",
  tx: "#212529",
  tx_2: "#6c757d",
  tx_3: "#adb5bd",
  pr: "#007bff",
  sc: "#6c757d",
  ac_1: "#dc3545",
  ac_2: "#28a745",
  ac_3: "#ffc107",
};

const sections = [
  {
    id: "01",
    title: "Color System",
    subtitle: "Backgrounds, text hierarchy, accent ramps, and semantic tokens",
  },
  {
    id: "02",
    title: "Typography",
    subtitle:
      "Display, heading scale, body text, data, and type scale reference",
  },
  {
    id: "03",
    title: "Components",
    subtitle: "Buttons, cards, tags, badges, and stat blocks",
  },
  {
    id: "04",
    title: "Forms",
    subtitle: "Text inputs, selects, search, and validation states",
  },
  {
    id: "05",
    title: "Data & Viz",
    subtitle: "Chart color palette, bar chart, and divider styles",
  },
];

export function DesignSystemPreview({
  theme,
  className,
}: DesignSystemPreviewProps) {
  const tinteTheme = useThemeStore((state) => state.tinteTheme);
  const currentMode = useThemeStore((state) => state.mode);
  const { fonts } = useThemeTokens();

  const colors = tinteTheme?.[currentMode] ?? DEFAULT_COLORS;

  return (
    <div
      className={className}
      style={{
        backgroundColor: colors.bg,
        color: colors.tx,
        fontFamily: fonts.sans,
        ["--font-sans" as string]: fonts.sans,
        ["--font-serif" as string]: fonts.serif,
        ["--font-mono" as string]: fonts.mono,
      }}
    >
      <div
        className="px-6 pt-8 pb-4 border-b"
        style={{ borderColor: colors.ui }}
      >
        <div
          className="text-xs font-mono uppercase tracking-widest mb-1"
          style={{ color: colors.pr }}
        >
          Design System
        </div>
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: colors.tx }}
        >
          {theme.brand.name}
        </h1>
        <p className="text-sm mt-1" style={{ color: colors.tx_3 }}>
          {theme.brand.description}
        </p>
      </div>

      <div className="divide-y" style={{ borderColor: colors.ui }}>
        <section className="px-6 py-10">
          <div className="flex items-start gap-6 mb-8">
            <span
              className="text-5xl font-bold leading-none flex-shrink-0"
              style={{ color: colors.ui_2 }}
            >
              {sections[0].id}
            </span>
            <div>
              <h2
                className="text-lg font-semibold"
                style={{ color: colors.tx }}
              >
                {sections[0].title}
              </h2>
              <p className="text-sm mt-0.5" style={{ color: colors.tx_3 }}>
                {sections[0].subtitle}
              </p>
            </div>
          </div>
          <ColorSystemSection colors={colors} />
        </section>

        <section className="px-6 py-10">
          <div className="flex items-start gap-6 mb-8">
            <span
              className="text-5xl font-bold leading-none flex-shrink-0"
              style={{ color: colors.ui_2 }}
            >
              {sections[1].id}
            </span>
            <div>
              <h2
                className="text-lg font-semibold"
                style={{ color: colors.tx }}
              >
                {sections[1].title}
              </h2>
              <p className="text-sm mt-0.5" style={{ color: colors.tx_3 }}>
                {sections[1].subtitle}
              </p>
            </div>
          </div>
          <TypographySection colors={colors} />
        </section>

        <section className="px-6 py-10">
          <div className="flex items-start gap-6 mb-8">
            <span
              className="text-5xl font-bold leading-none flex-shrink-0"
              style={{ color: colors.ui_2 }}
            >
              {sections[2].id}
            </span>
            <div>
              <h2
                className="text-lg font-semibold"
                style={{ color: colors.tx }}
              >
                {sections[2].title}
              </h2>
              <p className="text-sm mt-0.5" style={{ color: colors.tx_3 }}>
                {sections[2].subtitle}
              </p>
            </div>
          </div>
          <ComponentsSection colors={colors} />
        </section>

        <section className="px-6 py-10">
          <div className="flex items-start gap-6 mb-8">
            <span
              className="text-5xl font-bold leading-none flex-shrink-0"
              style={{ color: colors.ui_2 }}
            >
              {sections[3].id}
            </span>
            <div>
              <h2
                className="text-lg font-semibold"
                style={{ color: colors.tx }}
              >
                {sections[3].title}
              </h2>
              <p className="text-sm mt-0.5" style={{ color: colors.tx_3 }}>
                {sections[3].subtitle}
              </p>
            </div>
          </div>
          <FormsSection colors={colors} />
        </section>

        <section className="px-6 py-10">
          <div className="flex items-start gap-6 mb-8">
            <span
              className="text-5xl font-bold leading-none flex-shrink-0"
              style={{ color: colors.ui_2 }}
            >
              {sections[4].id}
            </span>
            <div>
              <h2
                className="text-lg font-semibold"
                style={{ color: colors.tx }}
              >
                {sections[4].title}
              </h2>
              <p className="text-sm mt-0.5" style={{ color: colors.tx_3 }}>
                {sections[4].subtitle}
              </p>
            </div>
          </div>
          <DataVizSection colors={colors} />
        </section>
      </div>
    </div>
  );
}
