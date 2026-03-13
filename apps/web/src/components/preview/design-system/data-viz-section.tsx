"use client";

import type { TinteBlock } from "@tinte/core";

interface DataVizSectionProps {
  colors: TinteBlock;
}

const barData = [
  { label: "AI / ML", value: 24, max: 30 },
  { label: "Biotech", value: 18, max: 30 },
  { label: "Fintech", value: 15, max: 30 },
  { label: "SaaS B2B", value: 22, max: 30 },
  { label: "DevTools", value: 28, max: 30 },
];

export function DataVizSection({ colors }: DataVizSectionProps) {
  const chartColors = [
    { label: "chart-1", value: colors.pr },
    { label: "chart-2", value: colors.sc },
    { label: "chart-3", value: colors.ac_1 },
    { label: "chart-4", value: colors.ac_2 },
    { label: "chart-5", value: colors.ac_3 },
  ];

  const palette = [colors.pr, colors.sc, colors.ac_1, colors.ac_2, colors.ac_3];

  return (
    <div className="space-y-10">
      <div>
        <p
          className="text-xs font-mono uppercase tracking-widest mb-4"
          style={{ color: colors.tx_3 }}
        >
          Chart Colors
        </p>
        <div className="flex gap-3 flex-wrap">
          {chartColors.map((c) => (
            <div key={c.label} className="flex flex-col items-center gap-1.5">
              <div
                className="w-12 h-12 rounded-lg"
                style={{ backgroundColor: c.value }}
              />
              <span
                className="text-xs font-mono"
                style={{ color: colors.tx_3 }}
              >
                {c.label}
              </span>
              <span
                className="text-xs font-mono"
                style={{ color: colors.tx_3 }}
              >
                {c.value}
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
          Horizontal Bar Chart
        </p>
        <div className="space-y-3 max-w-sm">
          {barData.map((item, i) => (
            <div key={item.label} className="flex items-center gap-3">
              <div
                className="text-xs w-16 flex-shrink-0 text-right"
                style={{ color: colors.tx_2 }}
              >
                {item.label}
              </div>
              <div
                className="flex-1 rounded-full overflow-hidden h-2"
                style={{ backgroundColor: colors.ui }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(item.value / item.max) * 100}%`,
                    backgroundColor: palette[i % palette.length],
                  }}
                />
              </div>
              <div
                className="text-xs font-mono w-6 flex-shrink-0"
                style={{ color: colors.tx_2 }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p
          className="text-xs font-mono uppercase tracking-widest mb-4"
          style={{ color: colors.tx_3 }}
        >
          Dividers & Separators
        </p>
        <div className="space-y-6">
          <div>
            <div className="text-xs mb-2" style={{ color: colors.tx_3 }}>
              Gradient line
            </div>
            <div
              className="h-px rounded-full"
              style={{
                background: `linear-gradient(to right, transparent, ${colors.pr}, transparent)`,
              }}
            />
          </div>
          <div>
            <div className="text-xs mb-2" style={{ color: colors.tx_3 }}>
              Subtle border
            </div>
            <div className="h-px" style={{ backgroundColor: colors.ui }} />
          </div>
          <div>
            <div className="text-xs mb-2" style={{ color: colors.tx_3 }}>
              Section fade
            </div>
            <div
              className="h-px"
              style={{
                background: `linear-gradient(to right, ${colors.ui}, transparent)`,
              }}
            />
          </div>
          <div>
            <div className="text-xs mb-2" style={{ color: colors.tx_3 }}>
              Dashed
            </div>
            <div
              className="border-t border-dashed"
              style={{ borderColor: colors.ui_2 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
