// components/LanguageSwitcher.tsx
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DefaultIcon, LanguageLogos } from "@/lib/language-logos";
import { LANGS } from "@/lib/constants";

interface LanguageSwitcherProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  selectedLanguage,
  onLanguageChange,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="language" className="text-muted-foreground">
        Language
      </Label>
      <Select value={selectedLanguage} onValueChange={onLanguageChange}>
        <SelectTrigger className="w-[145px]">
          <SelectValue id="language" placeholder="Select language">
            <div className="flex items-center gap-2">
              <LanguageLogo language={selectedLanguage} />
              {getLanguageDisplayName(selectedLanguage)}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {LANGS.map((lang) => (
            <SelectItem key={lang} value={lang}>
              <div className="flex items-center gap-2">
                <LanguageLogo language={lang} />
                {getLanguageDisplayName(lang)}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

function getLanguageDisplayName(lang: string) {
  if (
    (lang.length === 3 || lang.length === 4) &&
    !["ruby", "vue", "dart", "java", "rust", "zig"].includes(lang)
  ) {
    return lang.toUpperCase();
  }
  return lang.charAt(0).toUpperCase() + lang.slice(1);
}

function LanguageLogo({ language }: { language: string }): JSX.Element {
  const IconComponent = LanguageLogos[language] || DefaultIcon;
  return <IconComponent width={16} height={16} />;
}
