"use client";

import type { TinteBlock } from "@tinte/core";

interface FormsSectionProps {
  colors: TinteBlock;
}

export function FormsSection({ colors }: FormsSectionProps) {
  const inputStyle = {
    backgroundColor: colors.bg_2,
    color: colors.tx,
    border: `1px solid ${colors.ui}`,
    borderRadius: "6px",
    padding: "8px 12px",
    fontSize: "14px",
    width: "100%",
    outline: "none",
  } as const;

  const labelStyle = {
    fontSize: "13px",
    fontWeight: 500,
    color: colors.tx,
    marginBottom: "6px",
    display: "block",
  } as const;

  const hintStyle = {
    fontSize: "12px",
    color: colors.tx_3,
    marginTop: "4px",
  } as const;

  return (
    <div className="space-y-8">
      <div>
        <p
          className="text-xs font-mono uppercase tracking-widest mb-6"
          style={{ color: colors.tx_3 }}
        >
          Text Input
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-xl">
          <label>
            <span style={labelStyle}>Email address</span>
            <input
              type="email"
              placeholder="you@example.com"
              style={inputStyle}
            />
            <p style={hintStyle}>We'll never share your email.</p>
          </label>
          <label>
            <span style={labelStyle}>Full name</span>
            <input type="text" placeholder="Jane Smith" style={inputStyle} />
          </label>
        </div>
      </div>

      <div>
        <p
          className="text-xs font-mono uppercase tracking-widest mb-6"
          style={{ color: colors.tx_3 }}
        >
          Select
        </p>
        <div className="max-w-xs">
          <label>
            <span style={labelStyle}>Framework</span>
            <select
              style={{
                ...inputStyle,
                cursor: "pointer",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
                paddingRight: "32px",
              }}
            >
              <option value="">Select a framework</option>
              <option value="next">Next.js</option>
              <option value="remix">Remix</option>
              <option value="astro">Astro</option>
              <option value="vite">Vite</option>
            </select>
          </label>
        </div>
      </div>

      <div>
        <p
          className="text-xs font-mono uppercase tracking-widest mb-6"
          style={{ color: colors.tx_3 }}
        >
          Search Input
        </p>
        <div className="max-w-xs relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke={colors.tx_3}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <input
            type="search"
            placeholder="Search components..."
            style={{
              ...inputStyle,
              paddingLeft: "36px",
            }}
          />
        </div>
      </div>

      <div>
        <p
          className="text-xs font-mono uppercase tracking-widest mb-6"
          style={{ color: colors.tx_3 }}
        >
          Validation States
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-xl">
          <label>
            <span style={{ ...labelStyle, color: "#22C55E" }}>Username</span>
            <input
              type="text"
              defaultValue="hunter_dev"
              style={{
                ...inputStyle,
                border: "1px solid #22C55E",
              }}
            />
            <p style={{ ...hintStyle, color: "#22C55E" }}>
              Username is available.
            </p>
          </label>
          <label>
            <span style={{ ...labelStyle, color: colors.ac_1 }}>Password</span>
            <input
              type="password"
              defaultValue="weak"
              style={{
                ...inputStyle,
                border: `1px solid ${colors.ac_1}`,
              }}
            />
            <p style={{ ...hintStyle, color: colors.ac_1 }}>
              Password must be at least 8 characters.
            </p>
          </label>
        </div>
      </div>
    </div>
  );
}
