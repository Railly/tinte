import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        <SelectItem value="php">PHP</SelectItem>
        <SelectItem value="javascript">JavaScript</SelectItem>
        <SelectItem value="typescript">TypeScript</SelectItem>
        <SelectItem value="sql">SQL</SelectItem>
        <SelectItem value="go">Go</SelectItem>
        <SelectItem value="rust">Rust</SelectItem>
        <SelectItem value="python">Python</SelectItem>
        <SelectItem value="ruby">Ruby</SelectItem>
      </SelectContent>
    </Select>
  );
};
