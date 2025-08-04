'use client';

import * as React from 'react';
import { useMemo, useState } from 'react';
import { oklch } from 'culori';

import { ThemeSwitcher } from '@/components/shared/theme-switcher';
import { ProviderExperimentTabs } from '@/components/shared/provider-experiment-tabs';
import { useThemeContext } from '@/providers/theme';

// ⬇️ Ajusta esta ruta al archivo donde pegaste mi one-file (`ice-theme.ts`)
import {
  buildShadcnFromTinte,
  makePolineFromTinte,
  polineRampHex,
  chartColorsFromAccents,
  type ShadcnBlock,
} from '@/lib/ice-theme';
import type { TinteTheme } from '@/types/tinte';

// ─────────────────────────────────────────────
// Utils
// ─────────────────────────────────────────────
function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(' ');
}
async function copy(text: string) {
  try { await navigator.clipboard.writeText(text); } catch { }
}
function downloadJSON(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// OKLCH distance (rápida y suficiente para comparación visual)
function deltaOKLCH(a: string | undefined, b: string | undefined) {
  if (!a || !b) return NaN;
  const A = oklch(a), B = oklch(b);
  if (!A || !B) return NaN;
  const dl = (A.l ?? 0) - (B.l ?? 0);
  const dc = (A.c ?? 0) - (B.c ?? 0);
  let dh = (A.h ?? 0) - (B.h ?? 0);
  // wrap hue diff to [-180,180]
  dh = ((dh + 540) % 360) - 180;
  return Math.sqrt(dl * dl + dc * dc + (dh / 180) * (dh / 180));
}

function Swatch({ hex, label }: { hex?: string; label?: string }) {
  const bg = hex ?? '#000';
  const L = oklch(bg)?.l ?? 0.5;
  const fg = L > 0.58 ? '#0b0b0b' : '#ffffff';
  return (
    <button
      onClick={() => hex && copy(bg)}
      className="w-full h-8 rounded-md border text-[10px] leading-4 flex items-center justify-center"
      style={{ background: bg, color: fg, borderColor: 'hsl(0 0% 50% / .2)' }}
      title={hex}
    >
      {label ?? ''}
    </button>
  );
}

function TokenRow({
  name,
  real,
  gen,
}: {
  name: string;
  real?: string;
  gen?: string;
}) {
  const d = deltaOKLCH(real, gen);
  return (
    <div className="grid grid-cols-[120px,1fr,1fr,90px] items-center gap-3 text-sm">
      <div className="text-xs text-neutral-500 dark:text-neutral-400">{name}</div>
      <div className="flex items-center gap-2">
        <Swatch hex={real} label="Real" />
        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">{real}</div>
      </div>
      <div className="flex items-center gap-2">
        <Swatch hex={gen} label="Gen" />
        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">{gen}</div>
      </div>
      <div className={cx(
        'text-[11px] tabular-nums px-2 py-1 rounded-md text-center',
        isFinite(d) ? 'bg-neutral-100 dark:bg-neutral-800' : 'opacity-50'
      )}>
        {isFinite(d) ? `Δ ${d.toFixed(3)}` : '—'}
      </div>
    </div>
  );
}

function MiniPreview({ tokens }: { tokens: ShadcnBlock }) {
  return (
    <div
      className="rounded-xl border p-4 grid grid-cols-1 lg:grid-cols-3 gap-4"
      style={{ background: tokens.background, color: tokens.foreground, borderColor: tokens.border }}
    >
      {/* Buttons */}
      <div className="space-y-3">
        <div className="text-sm opacity-70">Buttons</div>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-md text-sm" style={{ background: tokens.primary, color: tokens['primary-foreground'] }}>Primary</button>
          <button className="px-3 py-2 rounded-md text-sm border" style={{ background: tokens.accent, color: tokens['accent-foreground'], borderColor: tokens.border }}>Accent</button>
          <button className="px-3 py-2 rounded-md text-sm border" style={{ background: tokens.secondary, color: tokens['secondary-foreground'], borderColor: tokens.border }}>Secondary</button>
        </div>
        <div className="text-sm opacity-70 pt-2">Input</div>
        <input
          placeholder="Type something…"
          className="w-full rounded-md px-3 py-2 text-sm outline-none"
          style={{ background: tokens.card, color: tokens['card-foreground'], border: `1px solid ${tokens.input}` }}
        />
      </div>
      {/* Card */}
      <div className="rounded-lg p-4 border space-y-2" style={{ background: tokens.card, color: tokens['card-foreground'], borderColor: tokens.border }}>
        <div className="text-sm opacity-70">Card</div>
        <div className="font-medium">Upgrade your plan</div>
        <div className="text-sm opacity-70">More features, more control.</div>
        <button className="mt-2 px-3 py-2 rounded-md text-sm" style={{ background: tokens.primary, color: tokens['primary-foreground'] }}>Get Pro</button>
      </div>
      {/* Chart bars */}
      <div className="space-y-2">
        <div className="text-sm opacity-70">Charts</div>
        <div className="flex items-end gap-2 h-28">
          {(['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'] as const).map((k, i) => (
            <div key={k} className="flex-1 rounded-md" style={{ background: (tokens as any)[k], height: `${40 + i * 12}px` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function ComparePage() {
  const { mounted, activeTheme, currentMode, currentTokens, tinteTheme } = useThemeContext();
  const [showAccentCharts, setShowAccentCharts] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<any>(null);
  const [enablePoline, setEnablePoline] = useState(true);
  const [polineConfig] = useState({
    numPoints: 11,
    preserveKeys: ['primary', 'secondary', 'accent', 'accent_2', 'accent_3'] as ('primary' | 'secondary' | 'accent' | 'accent_2' | 'accent_3')[],
  });

  const mode = currentMode;

  // Use selected theme from enhanced switcher or fallback to current theme
  const currentTinteTheme: TinteTheme | null = selectedTheme?.rawTheme ?? tinteTheme;

  const handleThemeSelection = (theme: any) => {
    setSelectedTheme(theme);
    // Also update the workbench state if needed
    // You might want to call handleThemeSelect here depending on your needs
  };

  // Generado (builder + Poline) desde tu Tinte actual
  const generatedShadcn: ShadcnBlock | null = useMemo(() => {
    if (!currentTinteTheme) return null;
    const built = buildShadcnFromTinte(currentTinteTheme);
    return built[mode];
  }, [currentTinteTheme, mode]);

  // Tokens reales usando el hook directamente (shadcn/ui)
  const realShadcn: Record<string, string> = currentTokens;

  // Rampa Poline (a partir de tu Tinte actual)
  const polineRamp: string[] = useMemo(() => {
    const block = currentTinteTheme?.[mode];
    if (!block) return [];
    return polineRampHex(makePolineFromTinte(block));
  }, [currentTinteTheme, mode]);

  // Charts desde accents (nueva funcionalidad)
  const accentCharts: string[] = useMemo(() => {
    const block = currentTinteTheme?.[mode];
    if (!block) return [];
    return chartColorsFromAccents(
      { accent: block.accent, accent_2: block.accent_2, accent_3: block.accent_3 },
      mode,
      block.background
    );
  }, [currentTinteTheme, mode]);

  if (!mounted) return <div className="p-8">Loading…</div>;

  const coreKeys = [
    'background', 'foreground', 'border', 'card', 'input', 'ring',
    'primary', 'primary-foreground',
    'secondary', 'secondary-foreground',
    'accent', 'accent-foreground',
    'muted', 'muted-foreground',
  ] as const;

  const chartKeys = ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'] as const;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Theme Experimentation Lab</h1>
          <div className="ml-auto flex items-center gap-3">
            <ThemeSwitcher variant="dual" />
          </div>
        </div>
        
        {/* Enhanced Theme Switcher */}
        <div className="flex items-center gap-4">
          {/* <EnhancedTinteThemeSwitcher
            activeTheme={selectedTheme}
            onSelect={handleThemeSelection}
            label="Select Theme"
            enablePoline={enablePoline}
            polineConfig={polineConfig}
          /> */}
          <div className="flex items-center gap-2">
            <label className="text-sm">
              <input
                type="checkbox"
                checked={enablePoline}
                onChange={(e) => setEnablePoline(e.target.checked)}
                className="mr-2"
              />
              Enable Poline
            </label>
          </div>
        </div>
      </div>

      {/* Provider Experiment Tabs */}
      <ProviderExperimentTabs theme={currentTinteTheme} />

      {/* Legacy Comparison Section (Optional) */}
      {currentTinteTheme && realShadcn && (
        <section className="space-y-3 border-t pt-8">
          <h2 className="text-lg font-medium">Legacy Comparison (Real vs Generated)</h2>
          
          {/* Poline ramp vs Charts reales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-md font-medium">Poline ramp (from current Tinte)</h3>
                <button onClick={() => copy(polineRamp.join(' '))} className="text-xs underline underline-offset-2 text-neutral-600 dark:text-neutral-300">
                  Copy hex list
                </button>
              </div>
              <div className="grid grid-cols-11 gap-2">
                {polineRamp.map((hex) => (
                  <div key={hex} className="h-8 rounded-md border" style={{ background: hex, borderColor: 'hsl(0 0% 50% / .2)' }} title={hex} />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-md font-medium">Charts comparison</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAccentCharts(false)}
                    className={cx(
                      "text-xs px-2 py-1 rounded-md",
                      !showAccentCharts ? "bg-neutral-200 dark:bg-neutral-700" : "text-neutral-600 dark:text-neutral-300"
                    )}
                  >
                    Poline
                  </button>
                  <button
                    onClick={() => setShowAccentCharts(true)}
                    className={cx(
                      "text-xs px-2 py-1 rounded-md",
                      showAccentCharts ? "bg-neutral-200 dark:bg-neutral-700" : "text-neutral-600 dark:text-neutral-300"
                    )}
                  >
                    Accents
                  </button>
                  <button onClick={() => copy(JSON.stringify(realShadcn, null, 2))} className="text-xs underline underline-offset-2 text-neutral-600 dark:text-neutral-300">
                    Copy tokens
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {chartKeys.map((k, i) => (
                  <div key={k} className="space-y-1">
                    <div className="h-8 rounded-md border" style={{
                      background: showAccentCharts ? accentCharts[i] : realShadcn[k],
                      borderColor: 'hsl(0 0% 50% / .2)'
                    }} />
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400 text-center">
                      {showAccentCharts ? `Accent ${i + 1}` : k}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                {showAccentCharts
                  ? "Charts from accents (accent, accent_2, accent_3 + variants with contrast)"
                  : "Real charts (current tokens from workbench)"
                }
              </div>
            </div>
          </div>

          {/* Comparación token por token */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-medium">Token diff (Real vs Generated)</h3>
              <div className="flex gap-2">
                <button onClick={() => downloadJSON(`real-shadcn-${mode}.json`, realShadcn)} className="rounded-md border px-3 py-1.5 text-sm">Export Real</button>
                <button onClick={() => generatedShadcn && downloadJSON(`generated-shadcn-${mode}.json`, generatedShadcn)} className="rounded-md border px-3 py-1.5 text-sm">Export Generated</button>
              </div>
            </div>

            <div className="rounded-xl border divide-y">
              <div className="grid grid-cols-[120px,1fr,1fr,90px] text-[11px] text-neutral-500 dark:text-neutral-400 px-3 py-2">
                <div>Token</div>
                <div>Real</div>
                <div>Generated</div>
                <div>Δ OKLCH</div>
              </div>
              {coreKeys.map((k) => (
                <div key={k} className="px-3 py-2">
                  <TokenRow
                    name={k}
                    real={realShadcn[k]}
                    gen={generatedShadcn ? (generatedShadcn as any)[k] : undefined}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Preview side-by-side */}
          <div className="space-y-3">
            <h3 className="text-md font-medium">Preview</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="text-sm opacity-70">Real (Workbench tokens)</div>
                <MiniPreview tokens={realShadcn as any as ShadcnBlock} />
              </div>
              <div className="space-y-2">
                <div className="text-sm opacity-70">
                  Generated ({showAccentCharts ? 'Accents' : 'Poline'} + builder)
                </div>
                {generatedShadcn ? (
                  <MiniPreview tokens={{
                    ...generatedShadcn,
                    ...(showAccentCharts && accentCharts.length >= 5 ? {
                      'chart-1': accentCharts[0],
                      'chart-2': accentCharts[1],
                      'chart-3': accentCharts[2],
                      'chart-4': accentCharts[3],
                      'chart-5': accentCharts[4],
                    } : {})
                  }} />
                ) : (
                  <div className="text-sm opacity-70">No Tinte found.</div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
