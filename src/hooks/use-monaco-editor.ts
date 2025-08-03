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

  // Use same theme structure as Shiki highlighter
  const themeNames = {
    light: "tinte-light",
    dark: "tinte-dark",
  };

  const currentThemeName = useMemo(() => {
    return currentMode === "dark" ? themeNames.dark : themeNames.light;
  }, [currentMode]);

  // Minimal view transition for theme changes only
  useEffect(() => {
    if (isReady && editorRef.current) {
      setIsViewTransitioning(true);
      const timer = setTimeout(() => setIsViewTransitioning(false), 300); // Reduced from 300ms
      return () => clearTimeout(timer);
    }
  }, [themeVersion, isReady]);

  // Create theme objects using same structure as Shiki highlighter
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

  // Initialize Monaco with Shiki integration
  const initializeMonaco = useCallback(
    async (monaco: any) => {
      // Check if we need to update based on theme version
      if (
        highlighterRef.current &&
        currentThemeVersionRef.current === themeVersion
      ) {
        console.log(
          "Monaco: Themes already up to date, skipping initialization"
        );
        return; // Already initialized with current theme version
      }

      try {
        console.log("Monaco: Initializing Shiki highlighter", {
          currentVersion: currentThemeVersionRef.current,
          newVersion: themeVersion,
        });

        // Create themes using same structure as Shiki highlighter
        const lightTheme = createThemeData("light");
        const darkTheme = createThemeData("dark");

        console.log("Monaco: Created theme data", { lightTheme, darkTheme });

        // Don't dispose - just create a new highlighter
        const highlighter = await createHighlighter({
          themes: [lightTheme, darkTheme],
          langs: ["python", "go", "javascript"],
        });

        // Register languages first
        ["python", "go", "javascript"].forEach((lang) => {
          if (
            !monaco.languages.getLanguages().some((l: any) => l.id === lang)
          ) {
            monaco.languages.register({ id: lang });
          }
        });

        // Apply shikiToMonaco integration
        shikiToMonaco(highlighter, monaco);

        // Update refs
        highlighterRef.current = highlighter;
        currentThemeVersionRef.current = themeVersion;
        console.log("Monaco: Shiki integration completed successfully");
      } catch (error) {
        console.error("Monaco: Failed to initialize Shiki:", error);
      }
    },
    [createThemeData, themeVersion]
  );

  // Simplified theme initialization following working pattern

  // Apply theme with smart fallback
  const applyTheme = useCallback(
    (editor: any, monaco: any, useBuiltInFallback = false) => {
      try {
        let themeToApply;

        if (useBuiltInFallback && !highlighterRef.current) {
          // Use built-in themes only before Shiki initialization
          themeToApply = currentMode === "dark" ? "vs-dark" : "vs";
        } else {
          // Use custom themes after Shiki initialization
          themeToApply = currentThemeName;
        }

        console.log("Monaco: Applying theme", {
          themeToApply,
          currentMode,
          useBuiltInFallback,
          hasShikiHighlighter: !!highlighterRef.current,
          templateLanguage: template.language,
        });

        monaco.editor.setTheme(themeToApply);
        console.log("Monaco: Theme set successfully to", themeToApply);

        // Update editor content and language
        const model = editor.getModel();
        if (model) {
          monaco.editor.setModelLanguage(model, template.language);
          editor.setValue(template.code);
        }

        // Force layout
        editor.layout();
      } catch (error) {
        console.error("Monaco: Failed to apply theme:", error, {
          attemptedTheme: useBuiltInFallback ? "built-in" : "custom",
          hasHighlighter: !!highlighterRef.current,
        });
      }
    },
    [currentThemeName, template, currentMode]
  );

  // Handle editor mount
  const handleEditorDidMount = useCallback(
    async (editor: any, monaco: any) => {
      editorRef.current = editor;
      monacoRef.current = monaco;

      // Apply built-in theme immediately to avoid blank screen
      applyTheme(editor, monaco, true);

      // Initialize Monaco with Shiki integration in background
      initializeMonaco(monaco).then(() => {
        // Apply custom theme once Shiki is ready
        setTimeout(() => {
          applyTheme(editor, monaco, false);
        }, 50); // Reduced from 100ms
      });
    },
    [initializeMonaco, applyTheme]
  );

  // Update theme when mode or version changes
  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      console.log("Monaco: Theme/mode changed, updating themes");

      // Only apply built-in theme if we don't have Shiki highlighter yet
      if (!highlighterRef.current) {
        applyTheme(editorRef.current, monacoRef.current, true);
      }

      // Re-initialize only if theme version changed
      initializeMonaco(monacoRef.current).then(() => {
        // Apply custom theme with reduced delay
        setTimeout(() => {
          console.log("Monaco: Applying updated theme:", currentThemeName);
          applyTheme(editorRef.current, monacoRef.current, false);
        }, 50); // Reduced from 100ms
      });
    }
  }, [
    currentMode,
    themeVersion,
    currentThemeName,
    initializeMonaco,
    applyTheme,
  ]);

  // Set ready state
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
