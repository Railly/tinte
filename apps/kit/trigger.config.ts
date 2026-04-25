import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: process.env.TRIGGER_PROJECT_ID ?? "TODO_TRIGGER_PROJECT_ID",
  maxDuration: 600,
  dirs: ["./src/trigger"],
});
