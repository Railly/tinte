import { config } from "dotenv";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootEnv = join(__dirname, "../../../.env");
config({ path: rootEnv });

const result = spawnSync("next", ["build"], {
  stdio: "inherit",
  cwd: join(__dirname, ".."),
  shell: true,
});
process.exit(result.status ?? 1);
