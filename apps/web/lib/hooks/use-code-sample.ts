import { useState } from "react";
import { CODE_SAMPLES, DEFAULT_LANGUAGE } from "@/lib/constants";
import { debounce } from "../utils";

export const useCodeSample = () => {
  const [colorPickerShouldBeHighlighted, setColorPickerShouldBeHighlighted] =
    useState({
      key: "",
      value: false,
    });

  const lastLanguage = window.localStorage.getItem("lastLanguage");
  const defaultLanguage = lastLanguage || DEFAULT_LANGUAGE;
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);
  const [code, setCode] = useState<string | undefined>(
    CODE_SAMPLES[defaultLanguage]
  );

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    handleCodeChange(CODE_SAMPLES[language]);
    window.localStorage.setItem("lastLanguage", language);
  };

  const handleCodeChange = debounce((value: string | undefined) => {
    setCode(value);
  }, 500);

  return {
    selectedLanguage,
    code,
    handleCodeChange,
    handleLanguageChange,
    colorPickerShouldBeHighlighted,
    setColorPickerShouldBeHighlighted,
  };
};
