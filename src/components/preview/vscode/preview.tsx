'use client';

import React from 'react';
import { ThemeMode } from '@/lib/providers/types';
import { ThemeData } from '@/lib/theme-applier';

interface VSCodePreviewProps {
  theme: ThemeData;
  mode: ThemeMode;
}

export function VSCodePreview({ theme, mode }: VSCodePreviewProps) {
  const tokens = theme.rawTheme[mode]

  const codeExample = `import React from 'react';
import { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

// This is a comment
export default function UserProfile({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <div className="user-profile">
      <h1>{user.name}</h1>
      <p className="email">{user.email}</p>
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Save' : 'Edit'}
      </button>
    </div>
  );
}`;

  return (
    <div
      className="rounded-lg border overflow-hidden font-mono text-sm"
      style={{
        backgroundColor: tokens.background || '#1e1e1e',
        color: tokens.text || '#d4d4d4',
      }}
    >
      {/* Title bar */}
      <div
        className="px-4 py-2 border-b flex items-center gap-2"
        style={{
          backgroundColor: tokens.background || '#2d2d30',
          borderColor: tokens.border || '#404040',
        }}
      >
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="text-xs ml-2">UserProfile.tsx</div>
      </div>

      {/* Code content */}
      <div className="p-4 overflow-auto">
        <pre className="text-sm leading-relaxed">
          {codeExample.split('\n').map((line, i) => (
            <div key={i} className="flex">
              <div
                className="w-8 text-right mr-4 select-none"
                style={{ color: tokens.text_2 || '#6a6a6a' }}
              >
                {i + 1}
              </div>
              <div
                dangerouslySetInnerHTML={{
                  __html: highlightSyntax(line, tokens)
                }}
              />
            </div>
          ))}
        </pre>
      </div>

      {/* Status bar */}
      <div
        className="px-4 py-1 text-xs flex items-center justify-between"
        style={{
          backgroundColor: tokens.primary || '#007acc',
          color: tokens.primary_foreground || '#ffffff',
        }}
      >
        <div>TypeScript React</div>
        <div>Ln 1, Col 1</div>
      </div>
    </div>
  );
}

function highlightSyntax(line: string, tokens: Record<string, string>): string {
  const keywordColor = tokens.primary || '#569cd6';
  const stringColor = tokens.accent || '#ce9178';
  const commentColor = tokens.text_3 || tokens.text_2 || '#6a9955';
  const typeColor = tokens.accent_2 || tokens.secondary || '#4ec9b0';

  return line
    .replace(/\b(import|export|from|interface|function|const|let|var|return|if|else|default)\b/g,
      `<span style="color: ${keywordColor}">$1</span>`)
    .replace(/(['"])(.*?)\1/g,
      `<span style="color: ${stringColor}">$1$2$1</span>`)
    .replace(/(\/\/.*$)/g,
      `<span style="color: ${commentColor}; font-style: italic">$1</span>`)
    .replace(/\b(User|React|useState)\b/g,
      `<span style="color: ${typeColor}">$1</span>`)
    .replace(/\b(\d+)\b/g,
      `<span style="color: ${stringColor}">$1</span>`);
}