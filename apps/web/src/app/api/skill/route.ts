// source of truth: skills/tinte/SKILL.md (repo root)
import SKILL_MD from "../../../../../../skills/tinte/SKILL.md";

export async function GET() {
  return new Response(SKILL_MD, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": 'inline; filename="SKILL.md"',
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
