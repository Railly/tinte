'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { VSCodeTheme } from '@/lib/providers/vscode';

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="border rounded overflow-hidden bg-muted animate-pulse" style={{ height: '400px' }}>
      <div className="p-4 text-muted-foreground">Loading Monaco Editor...</div>
    </div>
  ),
});

interface MonacoEditorPreviewProps {
  code: string;
  language: string;
  theme: VSCodeTheme;
  height?: string;
}

export function MonacoEditorPreview({
  code,
  language,
  theme,
  height = '400px'
}: MonacoEditorPreviewProps) {
  const editorRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    if (!monaco || !editor || !theme) return;
    
    editorRef.current = editor;

    try {
      // Ensure theme has required properties
      if (!theme.tokenColors || !theme.colors || !theme.name) {
        console.warn('Invalid theme structure, using default');
        return;
      }

      // Define the custom theme with safety checks
      const rules = theme.tokenColors
        .filter(token => token && token.scope && token.settings)
        .map(token => {
          const scopes = Array.isArray(token.scope) ? token.scope : [token.scope];
          return scopes
            .filter(scope => typeof scope === 'string')
            .map(scope => ({
              token: scope.replace(/\./g, ' '), // Monaco uses spaces instead of dots
              foreground: (token.settings.foreground || '#000000').replace('#', ''),
              fontStyle: token.settings.fontStyle || '',
            }));
        })
        .flat()
        .filter(rule => rule.token && rule.foreground);

      const customTheme = {
        base: theme.type === 'dark' ? 'vs-dark' : 'vs',
        inherit: true,
        rules,
        colors: theme.colors || {},
      };

      // Register the theme with a unique name
      const themeName = `${theme.name}_${Date.now()}`;
      monaco.editor.defineTheme(themeName, customTheme);
      monaco.editor.setTheme(themeName);
    } catch (error) {
      console.error('Failed to apply Monaco theme:', error);
    }
  };

  if (!isClient) {
    return (
      <div className="border rounded overflow-hidden bg-muted animate-pulse" style={{ height }}>
        <div className="p-4 text-muted-foreground">Loading Monaco Editor...</div>
      </div>
    );
  }

  return (
    <div className="border rounded overflow-hidden">
      <Editor
        height={height}
        language={language}
        value={code}
        onMount={handleEditorDidMount}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: 'on',
          glyphMargin: false,
          folding: false,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 3,
          renderLineHighlight: 'none',
        }}
      />
    </div>
  );
}