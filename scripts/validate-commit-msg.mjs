import { readFileSync } from "node:fs";

const filePath = process.argv[2];

if (!filePath) {
  console.error("Commit message file path is required.");
  process.exit(1);
}

const rawMessage = readFileSync(filePath, "utf8").trim();
const message = rawMessage.replace(/^(fixup! |squash! )/, "");

if (
  message.startsWith("Merge ") ||
  message.startsWith("Revert ") ||
  message.startsWith("Initial commit")
) {
  process.exit(0);
}

const conventionalCommit =
  /^(feat|fix|docs|refactor|chore|test|build|ci|perf|style)(\([^)]+\))?!?: .+/;

if (!conventionalCommit.test(message)) {
  console.error(
    [
      "Invalid commit message.",
      "Use conventional commits, for example:",
      "  feat: add theme sharing",
      "  fix(workbench): correct public share link",
    ].join("\n"),
  );
  process.exit(1);
}
