'use client';

import { useState, useEffect } from 'react';
import { codeToHtml } from 'shiki';
import { VSCodeTheme } from '@/lib/rayso-to-vscode';

interface CodePreviewProps {
  code: string;
  language: string;
  theme: VSCodeTheme;
  className?: string;
}

export function CodePreview({ code, language, theme, className = '' }: CodePreviewProps) {
  const [html, setHtml] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const highlightCode = async () => {
      try {
        setLoading(true);
        
        // Convert VS Code theme to Shiki-compatible format
        const shikiTheme = {
          name: theme.name,
          type: theme.type,
          colors: {
            'editor.background': theme.colors['editor.background'] || '#ffffff',
            'editor.foreground': theme.colors['editor.foreground'] || '#000000',
          },
          tokenColors: theme.tokenColors.map(token => ({
            scope: token.scope,
            settings: {
              foreground: token.settings.foreground,
              fontStyle: token.settings.fontStyle,
            }
          }))
        };

        const result = await codeToHtml(code, {
          lang: language as any,
          theme: shikiTheme as any,
        });
        
        setHtml(result);
      } catch (error) {
        console.error('Failed to highlight code:', error);
        setHtml(`<pre><code>${code}</code></pre>`);
      } finally {
        setLoading(false);
      }
    };

    highlightCode();
  }, [code, language, theme]);

  if (loading) {
    return (
      <div className={`bg-muted animate-pulse rounded ${className}`}>
        <div className="p-4 text-muted-foreground">Loading syntax highlighting...</div>
      </div>
    );
  }

  return (
    <div 
      className={`overflow-auto rounded border ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        backgroundColor: theme.colors['editor.background'],
        color: theme.colors['editor.foreground'],
      }}
    />
  );
}