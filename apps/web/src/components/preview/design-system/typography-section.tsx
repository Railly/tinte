"use client";

import type { TinteBlock } from "@tinte/core";

interface TypographySectionProps {
  colors: TinteBlock;
  serifHeadings?: boolean;
}

const typeScale = [
  { label: "xs", size: "12px", sample: "The quick brown fox" },
  { label: "sm", size: "14px", sample: "The quick brown fox" },
  { label: "base", size: "16px", sample: "The quick brown fox" },
  { label: "lg", size: "18px", sample: "The quick brown fox" },
  { label: "xl", size: "20px", sample: "The quick brown fox" },
  { label: "2xl", size: "24px", sample: "Build fast, ship faster" },
  { label: "3xl", size: "30px", sample: "Build fast, ship faster" },
  { label: "4xl", size: "36px", sample: "Build fast, ship faster" },
];

export function TypographySection({
  colors,
  serifHeadings,
}: TypographySectionProps) {
  const headingFont = serifHeadings
    ? "var(--font-serif, serif)"
    : "var(--font-sans, system-ui)";
  return (
    <div className="space-y-10">
      <div>
        <p
          className="text-xs font-mono uppercase tracking-widest mb-4"
          style={{ color: colors.tx_3 }}
        >
          Display
        </p>
        <div
          className="font-bold leading-none"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            color: colors.pr,
            fontFamily: headingFont,
            letterSpacing: "-0.03em",
          }}
        >
          Design Tokens
        </div>
        <div className="text-lg mt-2" style={{ color: colors.tx_2 }}>
          A systematic approach to visual consistency
        </div>
      </div>

      <div>
        <p
          className="text-xs font-mono uppercase tracking-widest mb-4"
          style={{ color: colors.tx_3 }}
        >
          Heading Scale
        </p>
        <div className="space-y-4">
          {[
            {
              tag: "H1",
              size: "36px",
              weight: "700",
              sample: "The Era of AI-Native Development",
            },
            {
              tag: "H2",
              size: "30px",
              weight: "600",
              sample: "Authentication for the Modern Stack",
            },
            {
              tag: "H3",
              size: "24px",
              weight: "600",
              sample: "Ship Production-Ready Features",
            },
            {
              tag: "H4",
              size: "20px",
              weight: "500",
              sample: "Built for developers, loved by teams",
            },
          ].map((h) => (
            <div key={h.tag} className="flex items-baseline gap-4">
              <span
                className="text-xs w-8 flex-shrink-0"
                style={{
                  color: colors.tx_3,
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                {h.tag}
              </span>
              <span
                style={{
                  fontSize: h.size,
                  fontWeight: h.weight,
                  color: colors.tx,
                  lineHeight: 1.2,
                  fontFamily: headingFont,
                }}
              >
                {h.sample}
              </span>
              <span
                className="text-xs ml-auto flex-shrink-0"
                style={{
                  color: colors.tx_3,
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                {h.size}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p
          className="text-xs font-mono uppercase tracking-widest mb-4"
          style={{ color: colors.tx_3 }}
        >
          Body Text
        </p>
        <div className="space-y-4">
          <p
            className="text-base leading-relaxed max-w-xl"
            style={{ color: colors.tx }}
          >
            Tinte generates cohesive color themes for your design system. Start
            from a single accent color and get a complete palette with semantic
            tokens, accessible contrast ratios, and framework-ready exports.
          </p>
          <p
            className="text-sm leading-relaxed max-w-xl"
            style={{ color: colors.tx_2 }}
          >
            Small variant — used for secondary content, descriptions, and
            supporting text that doesn't compete with primary copy.
          </p>
          <p className="text-xs" style={{ color: colors.tx_3 }}>
            Caption — metadata, timestamps, labels, and fine print
          </p>
        </div>
      </div>

      <div>
        <p
          className="text-xs font-mono uppercase tracking-widest mb-4"
          style={{ color: colors.tx_3 }}
        >
          Data & Numeric
        </p>
        <div className="flex flex-wrap gap-8 items-end">
          <div>
            <div
              className="font-bold tabular-nums"
              style={{
                fontSize: "42px",
                color: colors.tx,
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}
            >
              $2.4B
            </div>
            <div className="text-xs mt-1" style={{ color: colors.tx_3 }}>
              Total valuation
            </div>
          </div>
          <div>
            <div
              className="text-2xl font-semibold tabular-nums"
              style={{ color: colors.pr, letterSpacing: "-0.02em" }}
            >
              +24.7%
            </div>
            <div className="text-xs mt-1" style={{ color: colors.tx_3 }}>
              Growth rate
            </div>
          </div>
          <div>
            <code
              className="text-sm font-mono px-3 py-1.5 rounded-md"
              style={{
                backgroundColor: colors.bg_2,
                color: colors.pr,
                border: `1px solid ${colors.ui}`,
              }}
            >
              oklch(62.8% 0.258 29.23)
            </code>
            <div className="text-xs mt-1" style={{ color: colors.tx_3 }}>
              CSS reference
            </div>
          </div>
        </div>
      </div>

      <div>
        <p
          className="text-xs font-mono uppercase tracking-widest mb-4"
          style={{ color: colors.tx_3 }}
        >
          Type Scale Reference
        </p>
        <div className="grid grid-cols-1 gap-2">
          {typeScale.map((t) => (
            <div
              key={t.label}
              className="flex items-center gap-4 py-2 border-b"
              style={{ borderColor: colors.ui }}
            >
              <span
                className="text-xs w-10 flex-shrink-0"
                style={{
                  color: colors.tx_3,
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                {t.label}
              </span>
              <span
                className="text-xs w-12 flex-shrink-0"
                style={{
                  color: colors.tx_3,
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                {t.size}
              </span>
              <span
                className="flex-1 min-w-0 truncate"
                style={{ fontSize: t.size, color: colors.tx, lineHeight: 1.3 }}
              >
                {t.sample}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
