import type { KeyboardEvent } from "react";
import { LANGUAGES, type Language } from "@/lib/code-samples";

interface CodeInputProps {
  code: string;
  onChange: (code: string) => void;
  language: string;
  onLanguageChange: (lang: Language) => void;
}

export function CodeInput({
  code,
  onChange,
  language,
  onLanguageChange,
}: CodeInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = `${code.substring(0, start)}  ${code.substring(end)}`;
      onChange(newValue);
      requestAnimationFrame(() => {
        target.selectionStart = start + 2;
        target.selectionEnd = start + 2;
      });
    }
  };

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex items-center gap-2">
        <label
          htmlFor="language-select"
          className="text-xs text-[var(--muted-foreground)]"
        >
          Language
        </label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as Language)}
          className="text-xs bg-[var(--accent)] border border-[var(--border)] text-[var(--foreground)] rounded px-2 py-1 outline-none cursor-pointer hover:border-[var(--muted-foreground)] transition-colors"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        className="flex-1 w-full bg-[var(--accent)] border border-[var(--border)] text-[var(--foreground)] rounded-lg p-4 font-mono text-xs leading-relaxed outline-none resize-none hover:border-[var(--muted-foreground)] focus:border-[var(--muted-foreground)] transition-colors"
        style={{
          fontFamily: "var(--font-geist-mono), 'Fira Code', Menlo, monospace",
        }}
      />
    </div>
  );
}
