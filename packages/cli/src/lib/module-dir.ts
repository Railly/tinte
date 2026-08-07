import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

declare const __dirname: string | undefined;

/**
 * Directory of the currently executing module.
 *
 * Under `tsx`/`bun` (ESM) this comes from `import.meta.url`. Under the tsup CJS
 * bundle esbuild replaces `import.meta` with an empty object, so `import.meta.url`
 * is `undefined` and `fileURLToPath` throws. `__dirname` is the real value there,
 * so it is checked first and the ESM path is the fallback.
 */
export function moduleDir(metaUrl: string | undefined): string {
  // `__dirname` is a module-scoped binding in CJS, not a property of
  // globalThis, so it has to be referenced directly and guarded with typeof.
  if (typeof __dirname === "string" && __dirname.length > 0) {
    return __dirname;
  }

  if (typeof metaUrl === "string" && metaUrl.length > 0) {
    return dirname(fileURLToPath(metaUrl));
  }

  return process.cwd();
}
