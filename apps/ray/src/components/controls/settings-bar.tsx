"use client";

import { Check, ChevronDown, Hash, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LANGUAGES, LANGUAGE_LABELS } from "@/lib/code-samples";
import type { Language } from "@/lib/code-samples";
import { LANGUAGE_ICONS } from "@/lib/language-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

interface SettingsBarProps {
  padding: number;
  onPaddingChange: (v: number) => void;
  fontSize: number;
  onFontSizeChange: (v: number) => void;
  lineNumbers: "on" | "off";
  onLineNumbersChange: (v: "on" | "off") => void;
  mode: "light" | "dark";
  onModeChange: (v: "light" | "dark") => void;
  language: string;
  onLanguageChange: (v: string) => void;
}

const PADDING_OPTIONS = [16, 32, 64, 128];
const FONT_SIZE_OPTIONS = [12, 14, 16, 18];

function LanguagePicker({
  value,
  onChange,
}: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const Icon = LANGUAGE_ICONS[value];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen((o) => !o)}
        className="gap-1.5 text-xs"
      >
        {Icon && <Icon className="size-4" />}
        <span>{LANGUAGE_LABELS[value as Language] ?? value}</span>
        <ChevronDown className="size-3 text-muted-foreground" />
      </Button>

      {open && (
        <div className="absolute bottom-full mb-1 left-0 z-50 w-48 rounded-lg border bg-popover shadow-lg overflow-hidden">
          <div className="max-h-56 overflow-y-auto py-1">
            {LANGUAGES.map((lang) => {
              const LangIcon = LANGUAGE_ICONS[lang];
              const active = lang === value;
              return (
                <button
                  type="button"
                  key={lang}
                  onClick={() => {
                    onChange(lang);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-1.5 text-xs transition-colors text-left hover:bg-accent",
                    active && "bg-accent",
                  )}
                >
                  {LangIcon && <LangIcon className="size-4 shrink-0" />}
                  <span className="text-foreground flex-1">
                    {LANGUAGE_LABELS[lang] ?? lang}
                  </span>
                  {active && <Check className="size-3 text-foreground" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function SettingsBar({
  padding,
  onPaddingChange,
  fontSize,
  onFontSizeChange,
  lineNumbers,
  onLineNumbersChange,
  mode,
  onModeChange,
  language,
  onLanguageChange,
}: SettingsBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <LanguagePicker value={language} onChange={onLanguageChange} />

      <ButtonGroup>
        {PADDING_OPTIONS.map((opt) => (
          <Button
            key={opt}
            variant={padding === opt ? "default" : "outline"}
            size="xs"
            onClick={() => onPaddingChange(opt)}
          >
            {opt}
          </Button>
        ))}
      </ButtonGroup>

      <ButtonGroup>
        {FONT_SIZE_OPTIONS.map((opt) => (
          <Button
            key={opt}
            variant={fontSize === opt ? "default" : "outline"}
            size="xs"
            onClick={() => onFontSizeChange(opt)}
          >
            {opt}
          </Button>
        ))}
      </ButtonGroup>

      <Button
        variant={lineNumbers === "on" ? "default" : "outline"}
        size="icon-xs"
        onClick={() =>
          onLineNumbersChange(lineNumbers === "on" ? "off" : "on")
        }
      >
        <Hash />
      </Button>

      <Button
        variant="outline"
        size="icon-xs"
        onClick={() => onModeChange(mode === "dark" ? "light" : "dark")}
      >
        {mode === "dark" ? <Moon /> : <Sun />}
      </Button>

    </div>
  );
}
