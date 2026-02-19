"use client";

import { useEffect, useState, useCallback } from "react";
import { Check, Copy, Terminal, Sparkles } from "lucide-react";
import { codeToHtml } from "shiki";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      className={className ?? "absolute top-2 right-2 text-muted-foreground hover:text-foreground"}
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
    </Button>
  );
}

function HighlightedCode({
  code,
  lang,
}: {
  code: string;
  lang: string;
}) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    let cancelled = false;
    codeToHtml(code, {
      lang: lang as Parameters<typeof codeToHtml>[1]["lang"],
      theme: "one-dark-pro",
    }).then((result) => {
      if (!cancelled) setHtml(result);
    });
    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  return (
    <div className="relative group">
      {html ? (
        <div
          className="rounded-md text-[13px] font-mono overflow-x-auto [&_pre]:!bg-[#282c34] [&_pre]:p-3 [&_pre]:pr-10 [&_pre]:rounded-md [&_pre]:m-0"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="bg-[#282c34] rounded-md p-3 pr-10 text-[13px] font-mono overflow-x-auto text-muted-foreground">
          {code}
        </pre>
      )}
      <CopyButton text={code} className="absolute top-2 right-2 text-white/40 hover:text-white/80 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

const CURL_EXAMPLE = `curl -X POST https://ray.tinte.dev/api/v1/screenshot \\
  -H 'Content-Type: application/json' \\
  -d '{
    "code": "const greeting = \\"Hello, world!\\";",
    "language": "typescript",
    "theme": "one-hunter",
    "title": "hello.ts"
  }' -o screenshot.png`;

const SKILL_INSTALL_NPX = `npx skills add Railly/tinte`;

const SKILL_INSTALL_CURL = `mkdir -p ~/.claude/skills/ray && \\
  curl -sL https://ray.tinte.dev/api/v1/skill \\
  > ~/.claude/skills/ray/SKILL.md`;

const PARAMS = [
  { name: "code", type: "string", required: true, default: "-", desc: "Code to screenshot" },
  { name: "language", type: "string", required: false, default: '"typescript"', desc: "Syntax highlighting language" },
  { name: "theme", type: "string | object", required: false, default: '"one-hunter"', desc: "tinte.dev slug or inline TinteBlock" },
  { name: "mode", type: '"dark" | "light"', required: false, default: '"dark"', desc: "Color scheme" },
  { name: "padding", type: "number", required: false, default: "32", desc: "Outer padding (0-256)" },
  { name: "fontSize", type: "number", required: false, default: "14", desc: "Font size (8-32)" },
  { name: "lineNumbers", type: "boolean", required: false, default: "true", desc: "Show line numbers" },
  { name: "title", type: "string", required: false, default: '""', desc: "Window title text" },
  { name: "background", type: "string", required: false, default: '"midnight"', desc: "midnight, sunset, ocean, forest, ember, steel, aurora, none" },
  { name: "scale", type: "number", required: false, default: "2", desc: "Resolution (1-4x)" },
];

export function ApiDialog({ defaultTab = "api" }: { defaultTab?: "api" | "skill" }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(defaultTab);

  const openWith = useCallback((t: "api" | "skill") => {
    setTab(t);
    setOpen(true);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="xs"
          className="gap-1.5 text-muted-foreground hover:text-foreground"
          onClick={() => openWith("skill")}
        >
          <Sparkles className="size-3" />
          Skill
        </Button>
        <Button
          variant="ghost"
          size="xs"
          className="gap-1.5 text-muted-foreground hover:text-foreground"
          onClick={() => openWith("api")}
        >
          <Terminal className="size-3" />
          API
        </Button>
      </div>

      <DialogContent className="sm:max-w-2xl max-h-[85dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-mono text-base">ray.tinte.dev</DialogTitle>
          <DialogDescription>
            Generate code screenshots programmatically.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "api" | "skill")} className="mt-2">
          <TabsList variant="line">
            <TabsTrigger value="skill" className="gap-1.5">
              <Sparkles className="size-3" />
              Skill
            </TabsTrigger>
            <TabsTrigger value="api" className="gap-1.5">
              <Terminal className="size-3" />
              API
            </TabsTrigger>
          </TabsList>

          <TabsContent value="skill" className="space-y-4 mt-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Install with npx</h3>
              <HighlightedCode code={SKILL_INSTALL_NPX} lang="bash" />
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Or with curl</h3>
              <HighlightedCode code={SKILL_INSTALL_CURL} lang="bash" />
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Then just ask</h3>
              <div className="space-y-1.5 text-[13px] text-muted-foreground">
                <p className="italic">&quot;Take a screenshot of this function&quot;</p>
                <p className="italic">&quot;Ray this file with the dracula theme&quot;</p>
                <p className="italic">&quot;Generate a code image of my component&quot;</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Works with Claude Code, Cursor, and{" "}
              <a
                href="https://skills.sh"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                40+ agents
              </a>
              . 500+ tinte themes supported.
            </p>
          </TabsContent>

          <TabsContent value="api" className="space-y-4 mt-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Endpoint</h3>
              <HighlightedCode code="POST https://ray.tinte.dev/api/v1/screenshot" lang="http" />
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Example</h3>
              <HighlightedCode code={CURL_EXAMPLE} lang="bash" />
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Parameters</h3>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-2 font-medium">Param</th>
                      <th className="text-left p-2 font-medium">Type</th>
                      <th className="text-left p-2 font-medium">Default</th>
                      <th className="text-left p-2 font-medium hidden sm:table-cell">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PARAMS.map((p) => (
                      <tr key={p.name} className="border-b last:border-0">
                        <td className="p-2 font-mono">
                          {p.name}
                          {p.required && <span className="text-destructive ml-0.5">*</span>}
                        </td>
                        <td className="p-2 text-muted-foreground font-mono">{p.type}</td>
                        <td className="p-2 text-muted-foreground font-mono">{p.default}</td>
                        <td className="p-2 text-muted-foreground hidden sm:table-cell">{p.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Returns PNG binary. Use any{" "}
              <a
                href="https://tinte.dev/themes"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                tinte.dev theme
              </a>
              {" "}or pass an inline TinteBlock object.
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
