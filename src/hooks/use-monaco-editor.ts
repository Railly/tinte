import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { createHighlighter } from "shiki";
import { shikiToMonaco } from "@shikijs/monaco";
import { VSCodeTheme } from "@/lib/providers/vscode";

interface CodeTemplate {
  name: string;
  filename: string;
  language: string;
  code: string;
}

interface UseMonacoEditorProps {
  themeSet: { light: VSCodeTheme; dark: VSCodeTheme };
  currentMode: "light" | "dark";
  template: CodeTemplate;
  themeVersion: number;
}

export function useMonacoEditor({
  themeSet,
  currentMode,
  template,
  themeVersion,
}: UseMonacoEditorProps) {
  const editorRef = useRef<any>(null);
  const highlighterRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const currentThemeVersionRef = useRef<number>(-1);
  const [isReady, setIsReady] = useState(false);
  const [isViewTransitioning, setIsViewTransitioning] = useState(false);

  const themeNames = {
    light: "tinte-light",
    dark: "tinte-dark",
  };

  const currentThemeName = useMemo(() => {
    return currentMode === "dark" ? themeNames.dark : themeNames.light;
  }, [currentMode]);

  useEffect(() => {
    if (isReady && editorRef.current) {
      setIsViewTransitioning(true);
      const timer = setTimeout(() => setIsViewTransitioning(false), 300);
      return () => clearTimeout(timer);
    }
  }, [themeVersion, isReady]);

  const createThemeData = useCallback(
    (mode: "light" | "dark") => {
      const currentTheme = themeSet[mode];
      return {
        name: themeNames[mode],
        type: currentTheme.type,
        colors: {
          "editor.background":
            currentTheme.colors["editor.background"] ||
            (mode === "dark" ? "#1e1e1e" : "#ffffff"),
          "editor.foreground":
            currentTheme.colors["editor.foreground"] ||
            (mode === "dark" ? "#d4d4d4" : "#000000"),
          "editorLineNumber.foreground":
            currentTheme.colors["editorLineNumber.foreground"] || "#6a6a6a",
        },
        tokenColors: currentTheme.tokenColors.map((token) => ({
          scope: token.scope,
          settings: {
            foreground: token.settings.foreground,
            fontStyle: token.settings.fontStyle,
          },
        })),
      };
    },
    [themeSet]
  );

  const initializeMonaco = useCallback(
    async (monaco: any) => {
      if (
        highlighterRef.current &&
        currentThemeVersionRef.current === themeVersion
      ) {
        console.log(
          "Monaco: Themes already up to date, skipping initialization"
        );
        return;
      }

      try {
        console.log("Monaco: Initializing Shiki highlighter", {
          currentVersion: currentThemeVersionRef.current,
          newVersion: themeVersion,
        });

        const lightTheme = createThemeData("light");
        const darkTheme = createThemeData("dark");

        console.log("Monaco: Created theme data", { lightTheme, darkTheme });

        const highlighter = await createHighlighter({
          themes: [lightTheme, darkTheme],
          langs: ["python", "go", "javascript"],
        });

        ["python", "go", "javascript"].forEach((lang) => {
          if (
            !monaco.languages.getLanguages().some((l: any) => l.id === lang)
          ) {
            monaco.languages.register({ id: lang });
          }
        });

        shikiToMonaco(highlighter, monaco);

        highlighterRef.current = highlighter;
        currentThemeVersionRef.current = themeVersion;
        console.log("Monaco: Shiki integration completed successfully");
      } catch (error) {
        console.error("Monaco: Failed to initialize Shiki:", error);
      }
    },
    [createThemeData, themeVersion]
  );

  const applyTheme = useCallback(
    (editor: any, monaco: any) => {
      try {
        console.log("Monaco: Applying theme", {
          currentThemeName,
          currentMode,
          hasShikiHighlighter: !!highlighterRef.current,
          templateLanguage: template.language,
        });

        monaco.editor.setTheme(currentThemeName);
        console.log("Monaco: Theme set successfully to", currentThemeName);

        const model = editor.getModel();
        if (model) {
          monaco.editor.setModelLanguage(model, template.language);
          editor.setValue(template.code);
        }

        editor.layout();
      } catch (error) {
        console.error("Monaco: Failed to apply theme:", error, {
          attemptedTheme: currentThemeName,
          hasHighlighter: !!highlighterRef.current,
        });
      }
    },
    [currentThemeName, template, currentMode]
  );

  const handleEditorDidMount = useCallback(
    async (editor: any, monaco: any) => {
      editorRef.current = editor;
      monacoRef.current = monaco;

      await initializeMonaco(monaco);

      setTimeout(() => {
        applyTheme(editor, monaco);
      }, 50);
    },
    [initializeMonaco, applyTheme]
  );

  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      console.log("Monaco: Theme/mode changed, updating themes");

      initializeMonaco(monacoRef.current).then(() => {
        setTimeout(() => {
          console.log("Monaco: Applying updated theme:", currentThemeName);
          applyTheme(editorRef.current, monacoRef.current);
        }, 50);
      });
    }
  }, [
    currentMode,
    themeVersion,
    currentThemeName,
    initializeMonaco,
    applyTheme,
  ]);

  useEffect(() => {
    setIsReady(true);
  }, []);

  return {
    isReady,
    isViewTransitioning,
    currentThemeName,
    handleEditorDidMount,
  };
}
