import { afterAll, describe, expect, test } from "bun:test";
import { existsSync, readFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { oklch } from "culori";
import { fromCommand } from "./from";

const FIXTURE_PATH = join(
  import.meta.dir,
  "__fixtures__",
  "vercel-candidates.json",
);
const OUT_PATH = join(
  import.meta.dir,
  "__fixtures__",
  "vercel-identity.out.json",
);

function captureStdout(fn: () => Promise<number>): Promise<{
  exitCode: number;
  lines: string[];
}> {
  const originalLog = console.log;
  const lines: string[] = [];
  console.log = (...args: unknown[]) => {
    lines.push(args.map(String).join(" "));
  };
  return fn()
    .then((exitCode) => ({ exitCode, lines }))
    .finally(() => {
      console.log = originalLog;
    });
}

function silenceStderr<T>(fn: () => T): T {
  const originalError = console.error;
  console.error = () => {};
  try {
    return fn();
  } finally {
    console.error = originalError;
  }
}

afterAll(() => {
  if (existsSync(OUT_PATH)) unlinkSync(OUT_PATH);
});

describe("tinte from --emit-script", () => {
  test("prints extract.js to stdout", async () => {
    const { exitCode, lines } = await captureStdout(() =>
      fromCommand(["--emit-script"]),
    );
    expect(exitCode).toBe(0);
    const script = lines.join("\n");
    expect(script).toContain("extract");
    expect(script.length).toBeGreaterThan(100);
  });
});

describe("tinte from --normalize", () => {
  test("produces valid identity JSON with correct bg/fg for vercel", async () => {
    const { exitCode, lines } = await silenceStderr(() =>
      captureStdout(() =>
        fromCommand(["--normalize", FIXTURE_PATH, "--name", "vercel"]),
      ),
    );

    expect(exitCode).toBe(0);

    const output = JSON.parse(lines.join("\n"));

    expect(output.name).toBe("vercel");
    expect(output.theme.light.bg).toBeDefined();
    expect(output.theme.light.tx).toBeDefined();

    const bgOklch = oklch(output.theme.light.bg as string);
    const fgOklch = oklch(output.theme.light.tx as string);

    expect(bgOklch).not.toBeNull();
    expect(fgOklch).not.toBeNull();

    // vercel: bg near-black, fg near-white
    expect(bgOklch?.l ?? 1).toBeLessThan(0.2);
    expect(fgOklch?.l ?? 0).toBeGreaterThan(0.8);
  });

  test("detects primaryStyle 'inverted' for vercel (no recurring saturated hue)", async () => {
    const { lines } = await silenceStderr(() =>
      captureStdout(() =>
        fromCommand(["--normalize", FIXTURE_PATH, "--name", "vercel"]),
      ),
    );
    const output = JSON.parse(lines.join("\n"));
    expect(output.primaryStyle).toBe("inverted");
  });

  test("normalizes pill/full radii (3.35544e+07px -> full)", async () => {
    const { lines } = await silenceStderr(() =>
      captureStdout(() =>
        fromCommand(["--normalize", FIXTURE_PATH, "--name", "vercel"]),
      ),
    );
    const output = JSON.parse(lines.join("\n"));
    expect(output.radius).toBe("full");
  });

  test("colors are emitted in oklch() format", async () => {
    const { lines } = await silenceStderr(() =>
      captureStdout(() =>
        fromCommand(["--normalize", FIXTURE_PATH, "--name", "vercel"]),
      ),
    );
    const output = JSON.parse(lines.join("\n"));
    expect(output.theme.light.bg).toMatch(/^oklch\(/);
    expect(output.theme.light.tx).toMatch(/^oklch\(/);
  });

  test("writes to --out file when provided", async () => {
    await silenceStderr(() =>
      fromCommand([
        "--normalize",
        FIXTURE_PATH,
        "--name",
        "vercel",
        "--out",
        OUT_PATH,
      ]),
    );
    expect(existsSync(OUT_PATH)).toBe(true);
    const written = JSON.parse(readFileSync(OUT_PATH, "utf-8"));
    expect(written.name).toBe("vercel");
  });

  test("exits 2 with usage error when no mode flag given", async () => {
    const { exitCode } = await silenceStderr(() =>
      captureStdout(() => fromCommand([])),
    );
    expect(exitCode).toBe(2);
  });

  test("exits 2 when --normalize is missing the candidates path", async () => {
    const { exitCode } = await silenceStderr(() =>
      captureStdout(() => fromCommand(["--normalize"])),
    );
    expect(exitCode).toBe(2);
  });
});
