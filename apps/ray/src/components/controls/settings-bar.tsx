import { Moon, Sun, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LANGUAGES } from "@/lib/code-samples";
import { LANGUAGE_ICONS } from "@/lib/language-icons";
import { cn } from "@/lib/utils";

interface SettingsBarProps {
  padding: number;
  onPaddingChange: (v: number) => void;
  fontSize: number;
  onFontSizeChange: (v: number) => void;
  lineNumbers: "on" | "off";
  onLineNumbersChange: (v: "on" | "off") => void;
  mode: "light" | "dark";
  onModeChange: (v: "light" | "dark") => void;
  title: string;
  onTitleChange: (v: string) => void;
  language: string;
  onLanguageChange: (v: string) => void;
}

const PADDING_OPTIONS = [16, 32, 64, 128];
const FONT_SIZE_OPTIONS = [12, 14, 16, 18];

function DiscreteButtons({
  options,
  value,
  onChange,
  label,
}: {
  options: number[];
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[11px] text-[var(--muted-foreground)]">
        {label}
      </span>
      <div className="flex items-center rounded-md overflow-hidden border border-[var(--border)]">
        {options.map((opt) => (
          <button
            type="button"
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              "px-2 py-1 text-[11px] transition-colors",
              value === opt
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "bg-[var(--accent)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

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
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium bg-[var(--accent)] border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--muted-foreground)] transition-colors cursor-pointer"
      >
        {Icon && <Icon className="w-3.5 h-3.5" />}
        <span>{value}</span>
        <ChevronDown className="w-3 h-3 text-[var(--muted-foreground)]" />
      </button>

      {open && (
        <div className="absolute bottom-full mb-1 left-0 z-50 w-44 bg-[var(--accent)] border border-[var(--border)] rounded-lg shadow-2xl overflow-hidden">
          <div className="max-h-52 overflow-y-auto py-1">
            {LANGUAGES.map((lang) => {
              const LangIcon = LANGUAGE_ICONS[lang];
              return (
                <button
                  type="button"
                  key={lang}
                  onClick={() => {
                    onChange(lang);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-1.5 text-[11px] hover:bg-[var(--muted)] transition-colors text-left",
                    lang === value && "bg-[var(--muted)]",
                  )}
                >
                  {LangIcon && <LangIcon className="w-4 h-4 shrink-0" />}
                  <span className="text-[var(--foreground)] capitalize">
                    {lang}
                  </span>
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
  title,
  onTitleChange,
  language,
  onLanguageChange,
}: SettingsBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <LanguagePicker
        value={language}
        onChange={onLanguageChange}
      />

      <DiscreteButtons
        label="Pad"
        options={PADDING_OPTIONS}
        value={padding}
        onChange={onPaddingChange}
      />
      <DiscreteButtons
        label="Size"
        options={FONT_SIZE_OPTIONS}
        value={fontSize}
        onChange={onFontSizeChange}
      />

      <button
        type="button"
        onClick={() => onLineNumbersChange(lineNumbers === "on" ? "off" : "on")}
        className={cn(
          "px-2 py-1 rounded text-[11px] font-medium transition-colors border",
          lineNumbers === "on"
            ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
            : "bg-[var(--accent)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)]",
        )}
      >
        #
      </button>

      <button
        type="button"
        onClick={() => onModeChange(mode === "dark" ? "light" : "dark")}
        className="flex items-center gap-1 px-2 py-1 rounded text-[11px] bg-[var(--accent)] border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
      >
        {mode === "dark" ? (
          <Moon className="w-3 h-3" />
        ) : (
          <Sun className="w-3 h-3" />
        )}
      </button>

      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="untitled"
        className="bg-[var(--accent)] border border-[var(--border)] rounded px-2 py-1 text-[11px] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none w-24 hover:border-[var(--muted-foreground)] focus:border-[var(--muted-foreground)] transition-colors"
      />
    </div>
  );
}
