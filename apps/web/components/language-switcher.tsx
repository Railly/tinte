import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGS } from "@/lib/constants";

interface LanguageSwitcherProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

export const LanguageSwitcher = ({
  selectedLanguage,
  onLanguageChange,
}: LanguageSwitcherProps) => {
  return (
    <Select value={selectedLanguage} onValueChange={onLanguageChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {LANGS.map((lang) => (
          <SelectItem key={lang} value={lang}>
            {(lang.length === 3 || lang.length === 4) &&
            lang !== "ruby" &&
            lang !== "vue" &&
            lang !== "rust"
              ? lang.toUpperCase()
              : lang.charAt(0).toUpperCase() + lang.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
