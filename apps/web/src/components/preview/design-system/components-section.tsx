"use client";

import type { TinteBlock } from "@tinte/core";

interface ComponentsSectionProps {
  colors: TinteBlock;
}

function getContrastColor(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "#000000";
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

export function ComponentsSection({ colors }: ComponentsSectionProps) {
  const accentColors = [
    { label: "Primary", value: colors.pr },
    { label: "Secondary", value: colors.sc },
    { label: "Accent 1", value: colors.ac_1 },
    { label: "Accent 2", value: colors.ac_2 },
    { label: "Accent 3", value: colors.ac_3 },
  ];

  const statusBadges = [
    { label: "Pre-seed", color: colors.ac_3 },
    { label: "Seed", color: colors.ac_2 },
    { label: "Series A", color: colors.sc },
    { label: "Series B", color: colors.pr },
    { label: "Growth", color: colors.ac_1 },
  ];

  const stats = [
    {
      value: "12,847",
      label: "Active users",
      change: "+18.2%",
      positive: true,
    },
    {
      value: "$48.2K",
      label: "Monthly revenue",
      change: "+7.4%",
      positive: true,
    },
    { value: "99.97%", label: "Uptime SLA", change: "-0.02%", positive: false },
  ];

  const cards = [
    {
      initials: "AK",
      avatarColor: colors.pr,
      name: "Alex Kim",
      role: "Engineering Lead",
      tags: [
        { label: "TypeScript", color: colors.pr },
        { label: "React", color: colors.sc },
      ],
      meta: "Last active 2h ago",
    },
    {
      initials: "MJ",
      avatarColor: colors.sc,
      name: "Maya Johnson",
      role: "Product Designer",
      tags: [
        { label: "Figma", color: colors.ac_2 },
        { label: "Design Systems", color: colors.ac_3 },
      ],
      meta: "Last active 15m ago",
    },
  ];

  return (
    <div className="space-y-12">
      <div>
        <p
          className="text-xs font-mono uppercase tracking-widest mb-6"
          style={{ color: colors.tx_3 }}
        >
          Buttons
        </p>
        <div className="flex flex-wrap gap-3 items-start">
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              className="px-4 py-2 rounded-md text-sm font-medium transition-opacity"
              style={{
                backgroundColor: colors.pr,
                color: getContrastColor(colors.pr),
              }}
            >
              Primary
            </button>
            <span className="text-xs font-mono" style={{ color: colors.tx_3 }}>
              primary
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              className="px-4 py-2 rounded-md text-sm font-medium transition-opacity"
              style={{
                backgroundColor: colors.bg_2,
                color: colors.tx,
                border: `1px solid ${colors.ui}`,
              }}
            >
              Secondary
            </button>
            <span className="text-xs font-mono" style={{ color: colors.tx_3 }}>
              secondary
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              className="px-4 py-2 rounded-md text-sm font-medium transition-opacity"
              style={{
                backgroundColor: "transparent",
                color: colors.tx,
              }}
            >
              Ghost
            </button>
            <span className="text-xs font-mono" style={{ color: colors.tx_3 }}>
              ghost
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              className="px-4 py-2 rounded-md text-sm font-medium transition-opacity"
              style={{
                backgroundColor: colors.ac_1,
                color: getContrastColor(colors.ac_1),
              }}
            >
              Destructive
            </button>
            <span className="text-xs font-mono" style={{ color: colors.tx_3 }}>
              destructive
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              className="px-4 py-2 rounded-md text-sm font-medium"
              style={{
                backgroundColor: colors.ui,
                color: colors.tx_3,
                cursor: "not-allowed",
              }}
              disabled
            >
              Disabled
            </button>
            <span className="text-xs font-mono" style={{ color: colors.tx_3 }}>
              disabled
            </span>
          </div>
        </div>
      </div>

      <div>
        <p
          className="text-xs font-mono uppercase tracking-widest mb-6"
          style={{ color: colors.tx_3 }}
        >
          Cards
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {cards.map((card) => (
            <div
              key={card.name}
              className="rounded-xl p-4 border"
              style={{
                backgroundColor: colors.bg_2,
                borderColor: colors.ui,
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{
                    backgroundColor: card.avatarColor,
                    color: getContrastColor(card.avatarColor),
                  }}
                >
                  {card.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-semibold"
                    style={{ color: colors.tx }}
                  >
                    {card.name}
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{ color: colors.tx_2 }}
                  >
                    {card.role}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {card.tags.map((tag) => (
                  <span
                    key={tag.label}
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: tag.color + "20",
                      color: tag.color,
                    }}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
              <div
                className="text-xs mt-3 pt-3 border-t"
                style={{ color: colors.tx_3, borderColor: colors.ui }}
              >
                {card.meta}
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
          Tags & Badges
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {accentColors.map((ac) => (
            <span
              key={ac.label}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: ac.value + "20",
                color: ac.value,
                border: `1px solid ${ac.value}40`,
              }}
            >
              {ac.label}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {statusBadges.map((badge) => (
            <span
              key={badge.label}
              className="px-2.5 py-1 rounded-md text-xs font-semibold"
              style={{
                backgroundColor: badge.color,
                color: getContrastColor(badge.color),
              }}
            >
              {badge.label}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p
          className="text-xs font-mono uppercase tracking-widest mb-4"
          style={{ color: colors.tx_3 }}
        >
          Stat Blocks
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-4 border"
              style={{
                backgroundColor: colors.bg_2,
                borderColor: colors.ui,
              }}
            >
              <div className="text-xs mb-2" style={{ color: colors.tx_3 }}>
                {stat.label}
              </div>
              <div
                className="text-3xl font-bold tabular-nums"
                style={{
                  color: colors.tx,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div
                className="text-xs font-mono mt-2"
                style={{
                  color: stat.positive ? colors.ac_2 : colors.ac_1,
                }}
              >
                {stat.change}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
