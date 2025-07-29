'use client';

import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { VSCodeTheme } from '@/lib/providers/vscode';

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

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Define the custom theme
    const customTheme = {
      base: theme.type === 'dark' ? 'vs-dark' : 'vs',
      inherit: true,
      rules: theme.tokenColors.map(token => {
        const scopes = Array.isArray(token.scope) ? token.scope : [token.scope];
        return scopes.map(scope => ({
          token: scope.replace(/\./g, ' '), // Monaco uses spaces instead of dots
          foreground: token.settings.foreground.replace('#', ''),
          fontStyle: token.settings.fontStyle || '',
        }));
      }).flat(),
      colors: theme.colors,
    };

    // Register the theme
    monaco.editor.defineTheme(theme.name, customTheme);
    monaco.editor.setTheme(theme.name);
  };

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