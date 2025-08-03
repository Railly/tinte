import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { createHighlighter } from "shiki";
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
  const themesRegisteredRef = useRef<Set<string>>(new Set());
  const [isReady, setIsReady] = useState(false);
  const [isViewTransitioning, setIsViewTransitioning] = useState(false);

  const lightThemeName = "tinte-light";
  const darkThemeName = "tinte-dark";
  const currentThemeName =
    currentMode === "dark" ? darkThemeName : lightThemeName;

  // Minimal view transition for theme changes only
  useEffect(() => {
    if (isReady && editorRef.current) {
      setIsViewTransitioning(true);
      const timer = setTimeout(() => setIsViewTransitioning(false), 300);
      return () => clearTimeout(timer);
    }
  }, [themeVersion, isReady]);

  // Initialize Shiki highlighter once
  useEffect(() => {
    let mounted = true;

    const initializeShiki = async () => {
      if (!highlighterRef.current) {
        try {
          const highlighter = await createHighlighter({
            themes: [],
            langs: ["python", "go", "javascript"],
          });
          if (mounted) {
            highlighterRef.current = highlighter;
            setIsReady(true);
          }
        } catch (error) {
          console.error("Failed to initialize Shiki:", error);
          if (mounted) {
            setIsReady(true); // Continue without Shiki
          }
        }
      }
    };

    initializeShiki();
    return () => {
      mounted = false;
    };
  }, []);

  // Stable theme data
  const themeData = useMemo(
    () => ({
      light: {
        name: lightThemeName,
        type: themeSet.light.type,
        colors: themeSet.light.colors,
        tokenColors: themeSet.light.tokenColors.map((token) => ({
          scope: token.scope,
          settings: {
            foreground: token.settings.foreground,
            fontStyle: token.settings.fontStyle,
          },
        })),
      },
      dark: {
        name: darkThemeName,
        type: themeSet.dark.type,
        colors: themeSet.dark.colors,
        tokenColors: themeSet.dark.tokenColors.map((token) => ({
          scope: token.scope,
          settings: {
            foreground: token.settings.foreground,
            fontStyle: token.settings.fontStyle,
          },
        })),
      },
    }),
    [themeSet, lightThemeName, darkThemeName]
  );

  // Optimized theme registration with caching
  const registerThemes = useCallback(
    async (monaco: any) => {
      const themeKey = `${themeVersion}-${JSON.stringify(themeData)}`;

      if (themesRegisteredRef.current.has(themeKey)) {
        return; // Already registered
      }

      try {
        // Always use fallback registration for better reliability
        const createFallback = (theme: any, base: "vs" | "vs-dark") => ({
          base,
          inherit: true,
          rules: theme.tokenColors.flatMap((token: any) => {
            const scopes = Array.isArray(token.scope)
              ? token.scope
              : [token.scope];
            return scopes.filter(Boolean).map((scope: string) => ({
              token: scope.replace(/\./g, " "),
              foreground: token.settings.foreground?.replace("#", "") || "",
              fontStyle: token.settings.fontStyle || "",
            }));
          }),
          colors: theme.colors,
        });

        // Define both themes
        monaco.editor.defineTheme(
          lightThemeName,
          createFallback(themeData.light, "vs")
        );
        monaco.editor.defineTheme(
          darkThemeName,
          createFallback(themeData.dark, "vs-dark")
        );

        themesRegisteredRef.current.add(themeKey);
      } catch (error) {
        console.error("Failed to register themes:", error);
      }
    },
    [themeData, themeVersion, lightThemeName, darkThemeName]
  );

  // Apply theme and content
  const applyTheme = useCallback(
    (editor: any, monaco: any) => {
      try {
        // Set theme
        monaco.editor.setTheme(currentThemeName);

        // Update editor content and language
        const model = editor.getModel();
        if (model) {
          monaco.editor.setModelLanguage(model, template.language);
          editor.setValue(template.code);
        }

        // Force layout
        editor.layout();
      } catch (error) {
        console.error("Failed to apply theme:", error);
      }
    },
    [currentThemeName, template]
  );

  // Handle editor mount
  const handleEditorDidMount = useCallback(
    async (editor: any, monaco: any) => {
      editorRef.current = editor;
      monacoRef.current = monaco;

      // Register languages once
      ["python", "go", "javascript"].forEach((lang) => {
        if (!monaco.languages.getLanguages().some((l: any) => l.id === lang)) {
          monaco.languages.register({ id: lang });
        }
      });

      // Register themes and apply
      await registerThemes(monaco);
      applyTheme(editor, monaco);
    },
    [registerThemes, applyTheme]
  );

  // Update theme when mode or version changes
  useEffect(() => {
    if (
      editorRef.current &&
      monacoRef.current &&
      isReady &&
      !isViewTransitioning
    ) {
      registerThemes(monacoRef.current).then(() => {
        applyTheme(editorRef.current, monacoRef.current);
      });
    }
  }, [
    registerThemes,
    applyTheme,
    isReady,
    isViewTransitioning,
    currentMode,
    themeVersion,
  ]);

  return {
    isReady,
    isViewTransitioning,
    currentThemeName,
    handleEditorDidMount,
  };
}
