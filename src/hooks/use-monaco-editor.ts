import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { createHighlighter } from 'shiki';
import { shikiToMonaco } from '@shikijs/monaco';
import { VSCodeTheme } from '@/lib/providers/vscode';

interface CodeTemplate {
  name: string;
  filename: string;
  language: string;
  code: string;
}

interface UseMonacoEditorProps {
  themeSet: { light: VSCodeTheme; dark: VSCodeTheme };
  currentMode: 'light' | 'dark';
  template: CodeTemplate;
  themeVersion: number;
}

export function useMonacoEditor({ themeSet, currentMode, template, themeVersion }: UseMonacoEditorProps) {
  const editorRef = useRef<any>(null);
  const highlighterRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isViewTransitioning, setIsViewTransitioning] = useState(false);

  const lightThemeName = 'tinte-light';
  const darkThemeName = 'tinte-dark';
  const currentThemeName = currentMode === 'dark' ? darkThemeName : lightThemeName;

  // View transition loading (non-negotiable)
  useEffect(() => {
    setIsViewTransitioning(true);
    const timer = setTimeout(() => setIsViewTransitioning(false), 400);
    return () => clearTimeout(timer);
  }, [themeVersion, currentMode]);

  // Single initialization effect
  useEffect(() => {
    let mounted = true;

    const initializeEditor = async () => {
      if (!highlighterRef.current) {
        try {
          const highlighter = await createHighlighter({
            themes: [],
            langs: ['python', 'rust', 'go', 'javascript']
          });
          if (mounted) {
            highlighterRef.current = highlighter;
          }
        } catch (error) {
          console.error('Failed to initialize Shiki:', error);
        }
      }

      if (mounted) {
        setIsReady(true);
      }
    };

    initializeEditor();
    return () => { mounted = false; };
  }, []);

  // Single theme data memo
  const themeData = useMemo(() => ({
    light: {
      name: lightThemeName,
      type: themeSet.light.type,
      colors: themeSet.light.colors,
      tokenColors: themeSet.light.tokenColors.map(token => ({
        scope: token.scope,
        settings: {
          foreground: token.settings.foreground,
          fontStyle: token.settings.fontStyle,
        }
      }))
    },
    dark: {
      name: darkThemeName,
      type: themeSet.dark.type,
      colors: themeSet.dark.colors,
      tokenColors: themeSet.dark.tokenColors.map(token => ({
        scope: token.scope,
        settings: {
          foreground: token.settings.foreground,
          fontStyle: token.settings.fontStyle,
        }
      }))
    }
  }), [themeSet, themeVersion]);

  // Single editor setup and update handler
  const setupEditor = useCallback(async (editor: any, monaco: any) => {
    // Register languages once
    ['python', 'rust', 'go', 'javascript'].forEach(lang => {
      if (!monaco.languages.getLanguages().some((l: any) => l.id === lang)) {
        monaco.languages.register({ id: lang });
      }
    });

    // Register themes
    try {
      if (highlighterRef.current) {
        await Promise.all([
          highlighterRef.current.loadTheme(themeData.light),
          highlighterRef.current.loadTheme(themeData.dark)
        ]);
        shikiToMonaco(highlighterRef.current, monaco);
      } else {
        // Fallback theme registration
        const createFallback = (theme: any, base: 'vs' | 'vs-dark') => ({
          base,
          inherit: true,
          rules: theme.tokenColors.flatMap((token: any) => {
            const scopes = Array.isArray(token.scope) ? token.scope : [token.scope];
            return scopes.map((scope: string) => ({
              token: scope.replace(/\./g, ' '),
              foreground: token.settings.foreground?.replace('#', '') || '',
              fontStyle: token.settings.fontStyle || '',
            }));
          }),
          colors: theme.colors,
        });

        monaco.editor.defineTheme(lightThemeName, createFallback(themeSet.light, 'vs'));
        monaco.editor.defineTheme(darkThemeName, createFallback(themeSet.dark, 'vs-dark'));
      }

      // Apply theme and update editor
      monaco.editor.setTheme(currentThemeName);
      editor.updateOptions({ theme: currentThemeName });
      
      // Set content
      const model = editor.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, template.language);
        editor.setValue(template.code);
        
        // Force tokenization reset
        if ((model as any)._tokenization) {
          (model as any)._tokenization.resetTokenization();
        }
      }

      // Force layout
      editor.layout();
      setTimeout(() => editor.layout(), 0);

    } catch (error) {
      console.error('Failed to setup editor:', error);
    }
  }, [themeData, currentThemeName, template, themeSet]);

  // Single effect for all updates
  useEffect(() => {
    if (editorRef.current && isReady) {
      const monaco = (window as any).monaco;
      if (monaco) {
        setupEditor(editorRef.current, monaco);
      }
    }
  }, [setupEditor, isReady, themeVersion, currentMode, template]);

  const handleEditorDidMount = useCallback(async (editor: any, monaco: any) => {
    editorRef.current = editor;
    if (isReady) {
      await setupEditor(editor, monaco);
    }
  }, [isReady, setupEditor]);

  return {
    isReady,
    isViewTransitioning,
    currentThemeName,
    handleEditorDidMount
  };
}