import type { SeedPayload } from "./seed-mapper";

const SS = () => (typeof window !== "undefined" ? window.sessionStorage : null);
const LS = () => (typeof window !== "undefined" ? window.localStorage : null);
const KEY = (id: string) => `seed:${id}`;
const TTL_MS = 15 * 60 * 1000;

export function writeSeed(id: string, payload: SeedPayload) {
  const json = JSON.stringify(payload);
  SS()?.setItem(KEY(id), json);
  try {
    LS()?.setItem(KEY(id), json);
  } catch {}
}

export function popSeed(id: string): SeedPayload | null {
  const now = Date.now();
  const read = (s: Storage | null) => {
    const raw = s?.getItem(KEY(id));
    if (!raw) return null;
    try {
      const data = JSON.parse(raw) as SeedPayload;
      if (!data.createdAt || now - data.createdAt > TTL_MS) {
        s?.removeItem(KEY(id));
        return null;
      }
      return data;
    } catch {
      s?.removeItem(KEY(id));
      return null;
    }
  };
  return read(SS()) ?? read(LS());
}

export function clearSeed(id: string) {
  SS()?.removeItem(KEY(id));
  LS()?.removeItem(KEY(id));
}
