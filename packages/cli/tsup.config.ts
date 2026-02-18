import { defineConfig } from "tsup";

export default defineConfig([
  // CLI build
  {
    entry: { cli: "src/cli.ts" },
    format: ["cjs"],
    dts: false,
    clean: true,
    splitting: false,
    sourcemap: true,
    minify: false,
    target: "node16",
    banner: {
      js: "#!/usr/bin/env node",
    },
    esbuildOptions: (options) => {
      options.conditions = ["node"];
      options.platform = "node";
    },
  },
  // Library build
  {
    entry: { index: "src/index.ts" },
    format: ["cjs", "esm"],
    dts: true,
    clean: false,
    splitting: false,
    sourcemap: true,
    minify: true,
    target: "node16",
    esbuildOptions: (options) => {
      options.conditions = ["node"];
      options.platform = "node";
    },
  },
]);
