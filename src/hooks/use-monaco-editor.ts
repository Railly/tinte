import { shikiToMonaco } from "@shikijs/monaco";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createHighlighter } from "shiki";
import type { VSCodeTheme } from "@/lib/providers/vscode";

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
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isViewTransitioning, setIsViewTransitioning] = useState(false);

  const themeNames = {
    light: "tinte-light",
    dark: "tinte-dark",
  };

  const currentThemeName = useMemo(() => {
    return currentMode === "dark" ? themeNames.dark : themeNames.light;
  }, [currentMode]);

  // View transition to prevent flickering during theme changes
  const prevThemeVersionRef = useRef<number>(-1);
  const prevModeRef = useRef<string>("");

  useEffect(() => {
    const hasThemeVersionChanged = prevThemeVersionRef.current !== themeVersion;
    const hasModeChanged = prevModeRef.current !== currentMode;
    const hasRealChange = hasThemeVersionChanged || hasModeChanged;

    if (isReady && editorRef.current && !isInitialLoad && hasRealChange) {
      setIsViewTransitioning(true);
      const timer = setTimeout(() => setIsViewTransitioning(false), 100); // Faster transition to reduce flash

      // Update refs
      prevThemeVersionRef.current = themeVersion;
      prevModeRef.current = currentMode;

      return () => clearTimeout(timer);
    } else if (isInitialLoad) {
      // Initialize refs on first load
      prevThemeVersionRef.current = themeVersion;
      prevModeRef.current = currentMode;
    }
  }, [isReady, isInitialLoad, themeVersion, currentMode]);

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
    [themeSet],
  );

  const initializeMonaco = useCallback(
    async (monaco: any) => {
      if (
        highlighterRef.current &&
        currentThemeVersionRef.current === themeVersion
      ) {
        return;
      }

      try {
        const lightTheme = createThemeData("light");
        const darkTheme = createThemeData("dark");

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
      } catch (error) {
        console.error("Monaco: Failed to initialize Shiki:", error);
      }
    },
    [createThemeData, themeVersion],
  );

  const applyTheme = useCallback(
    (editor: any, monaco: any) => {
      try {
        monaco.editor.setTheme(currentThemeName);

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
    [currentThemeName, template],
  );

  const handleEditorDidMount = useCallback(
    async (editor: any, monaco: any) => {
      editorRef.current = editor;
      monacoRef.current = monaco;

      await initializeMonaco(monaco);

      // Immediate theme application for initial load
      setTimeout(
        () => {
          applyTheme(editor, monaco);
          setIsInitialLoad(false); // Mark initial load complete
        },
        isInitialLoad ? 0 : 50,
      );
    },
    [initializeMonaco, applyTheme, isInitialLoad],
  );

  useEffect(() => {
    if (editorRef.current && monacoRef.current && !isInitialLoad) {
      initializeMonaco(monacoRef.current).then(() => {
        applyTheme(editorRef.current, monacoRef.current);
      });
    }
  }, [currentThemeName, initializeMonaco, applyTheme, isInitialLoad]);

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
