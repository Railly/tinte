import { useQueryState } from "nuqs";
import { useShadcnTheme } from "./use-shadcn-theme";

export const useShadcnSelectedTheme = () => {
  const [selectedThemeId, setSelectedThemeId] = useQueryState("id");

  const selectedTheme = useShadcnTheme(selectedThemeId as string, {
    enabled: !!selectedThemeId,
  });

  return { selectedThemeId, setSelectedThemeId, ...selectedTheme };
};
