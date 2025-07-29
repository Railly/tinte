'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { VSCodeTheme } from '@/lib/tinte-to-vscode/types';
import { useTheme } from 'next-themes';
import Editor from '@monaco-editor/react';
import { shikiToMonaco } from '@shikijs/monaco';
import { createHighlighter } from 'shiki';
import { codeToHtml } from 'shiki';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useThemeApplier } from '@/hooks/use-theme-applier';
import { adapterRegistry } from '@/lib/adapters';
import { shadcnToTinte } from '@/lib/shadcn-to-tinte';

interface VSCodePreviewProps {
  theme: { light: VSCodeTheme; dark: VSCodeTheme };
  className?: string;
}

interface CodeTemplate {
  name: string;
  filename: string;
  language: string;
  code: string;
}

const codeTemplates: CodeTemplate[] = [
  {
    name: 'TypeScript React',
    filename: 'UserProfile.tsx',
    language: 'typescript',
    code: `import React from 'react';
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
}`
  },
  {
    name: 'Python',
    filename: 'user_service.py',
    language: 'python',
    code: `from typing import Optional, List
import asyncio
from dataclasses import dataclass

@dataclass
class User:
    id: int
    name: str
    email: str
    is_active: bool = True

class UserService:
    def __init__(self, database_url: str):
        self.db_url = database_url
        self.users: List[User] = []
    
    async def get_user(self, user_id: int) -> Optional[User]:
        """Fetch a user by ID"""
        for user in self.users:
            if user.id == user_id:
                return user
        return None
    
    def create_user(self, name: str, email: str) -> User:
        user = User(
            id=len(self.users) + 1,
            name=name,
            email=email
        )
        self.users.append(user)
        return user`
  },
  {
    name: 'Rust',
    filename: 'main.rs',
    language: 'rust',
    code: `use std::collections::HashMap;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
struct User {
    id: u64,
    name: String,
    email: String,
    is_active: bool,
}

impl User {
    fn new(id: u64, name: String, email: String) -> Self {
        Self {
            id,
            name,
            email,
            is_active: true,
        }
    }
    
    fn deactivate(&mut self) {
        self.is_active = false;
    }
}

fn main() {
    let mut users: HashMap<u64, User> = HashMap::new();
    
    let user = User::new(1, "Alice".to_string(), "alice@example.com".to_string());
    users.insert(user.id, user);
    
    println!("Created {} users", users.len());
}`
  },
  {
    name: 'Go',
    filename: 'main.go',
    language: 'go',
    code: `package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type User struct {
	ID       int    \`json:"id"\`
	Name     string \`json:"name"\`
	Email    string \`json:"email"\`
	IsActive bool   \`json:"is_active"\`
}

type UserService struct {
	users map[int]*User
}

func NewUserService() *UserService {
	return &UserService{
		users: make(map[int]*User),
	}
}

func (s *UserService) CreateUser(name, email string) *User {
	user := &User{
		ID:       len(s.users) + 1,
		Name:     name,
		Email:    email,
		IsActive: true,
	}
	s.users[user.ID] = user
	return user
}

func main() {
	service := NewUserService()
	user := service.CreateUser("John Doe", "john@example.com")
	fmt.Printf("Created user: %+v\\n", user)
}`
  }
];

// Normalize theme name for Monaco (alphanumeric and dashes only)
function normalizeThemeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
}

export function VSCodePreview({ theme, className }: VSCodePreviewProps) {
  const { resolvedTheme } = useTheme();
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [viewMode, setViewMode] = useState<'split' | 'monaco' | 'shiki' | 'tokens'>('split');
  const themeApplierChange = useThemeApplier();
  const [themeVersion, setThemeVersion] = useState(0);

  // Build complete theme object with both light and dark variants
  let currentThemeSet = theme;
  
  // If we have a theme change from theme-applier, convert using the same logic as debug page
  if (themeApplierChange?.themeData?.rawTheme) {
    try {
      const themeData = themeApplierChange.themeData;
      
      // Check if theme is from TweakCN (ShadCN format)
      if (themeData.author === "tweakcn" && themeData.rawTheme) {
        // For TweakCN themes: ShadCN → Tinte → VSCode (same as debug page logic)
        const shadcnTheme = {
          light: themeData.rawTheme.light || themeData.rawTheme,
          dark: themeData.rawTheme.dark || themeData.rawTheme
        };
        const tinteTheme = shadcnToTinte(shadcnTheme);
        const vscodeTheme = adapterRegistry.convert('vscode', tinteTheme) as { dark: VSCodeTheme; light: VSCodeTheme };
        if (vscodeTheme) {
          currentThemeSet = vscodeTheme;
        }
      } else {
        // For direct Tinte themes: Tinte → VSCode
        const tinteTheme = themeData.rawTheme;
        const vscodeTheme = adapterRegistry.convert('vscode', tinteTheme) as { dark: VSCodeTheme; light: VSCodeTheme };
        if (vscodeTheme) {
          currentThemeSet = vscodeTheme;
        }
      }
    } catch (error) {
      console.warn('Failed to convert theme from theme-applier:', error);
    }
  }

  const currentTheme = resolvedTheme === 'dark' ? currentThemeSet.dark : currentThemeSet.light;
  const currentMode = resolvedTheme === 'dark' ? 'dark' : 'light';

  // Force theme update when theme-applier changes
  useEffect(() => {
    if (themeApplierChange) {
      setThemeVersion(prev => prev + 1);
    }
  }, [themeApplierChange]);

  const tokens = currentTheme.colors || {};
  const currentTemplate = codeTemplates[selectedTemplate];

  return (
    <div
      className={`rounded-lg border overflow-hidden font-mono text-sm ${className || ''}`}
      style={{
        backgroundColor: tokens['editor.background'] || '#1e1e1e',
        color: tokens['editor.foreground'] || '#d4d4d4',
      }}
    >
      {/* Title bar */}
      <div
        className="px-4 py-2 border-b flex items-center gap-2"
        style={{
          backgroundColor: tokens['titleBar.activeBackground'] || '#2d2d30',
          borderColor: tokens['titleBar.border'] || '#404040',
        }}
      >
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="text-xs ml-2">{currentTemplate.filename}</div>
        <div className="text-xs text-muted-foreground ml-2">
          {currentTheme.displayName || currentTheme.name}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* View Mode Selector */}
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="w-auto">
            <TabsList className="h-6 bg-transparent border">
              <TabsTrigger value="split" className="text-xs px-2 py-1 h-5">
                Split
              </TabsTrigger>
              <TabsTrigger value="monaco" className="text-xs px-2 py-1 h-5">
                Monaco
              </TabsTrigger>
              <TabsTrigger value="shiki" className="text-xs px-2 py-1 h-5">
                Shiki
              </TabsTrigger>
              <TabsTrigger value="tokens" className="text-xs px-2 py-1 h-5">
                Tokens
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Language Selector */}
          <Select value={selectedTemplate.toString()} onValueChange={(value) => setSelectedTemplate(parseInt(value))}>
            <SelectTrigger className="w-32 h-6 text-xs border-none bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {codeTemplates.map((template, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-hidden">
        {viewMode === 'split' && (
          <div className="flex h-[800px]">
            {/* Monaco Editor */}
            <div className="flex-1 border-r border-border/50">
              <div className="bg-muted/50 px-2 py-1 border-b border-border/50 flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">Monaco Editor</Badge>
              </div>
              <div className="h-[calc(100%-2rem)]">
                <MonacoSection
                  themeSet={currentThemeSet}
                  currentMode={currentMode}
                  template={currentTemplate}
                  themeVersion={themeVersion}
                />
              </div>
            </div>

            {/* Shiki */}
            <div className="flex-1">
              <div className="bg-muted/50 px-2 py-1 border-b border-border/50 flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">Shiki</Badge>
              </div>
              <div className="h-[calc(100%-2rem)]">
                <ShikiSection
                  themeSet={currentThemeSet}
                  currentMode={currentMode}
                  template={currentTemplate}
                  themeVersion={themeVersion}
                />
              </div>
            </div>
          </div>
        )}

        {viewMode === 'monaco' && (
          <div className="h-[400px]">
            <MonacoSection
              themeSet={currentThemeSet}
              currentMode={currentMode}
              template={currentTemplate}
              themeVersion={themeVersion}
            />
          </div>
        )}

        {viewMode === 'shiki' && (
          <div className="h-[400px]">
            <ShikiSection
              themeSet={currentThemeSet}
              currentMode={currentMode}
              template={currentTemplate}
              themeVersion={themeVersion}
            />
          </div>
        )}

        {viewMode === 'tokens' && (
          <div className="h-[800px] overflow-auto">
            <TokensSection
              theme={currentTheme}
              mode={currentMode}
            />
          </div>
        )}
      </div>

      {/* Status bar */}
      <div
        className="px-4 py-1 text-xs flex items-center justify-between"
        style={{
          backgroundColor: tokens['statusBar.background'] || '#007acc',
          color: tokens['statusBar.foreground'] || '#ffffff',
        }}
      >
        <div>{currentTemplate.name} • {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View</div>
        <div>Ln 1, Col 1</div>
      </div>
    </div>
  );
}

// Monaco Editor Section
interface SectionProps {
  themeSet: { light: VSCodeTheme; dark: VSCodeTheme };
  currentMode: 'light' | 'dark';
  template: CodeTemplate;
  themeVersion: number;
}

function MonacoSection({ themeSet, currentMode, template, themeVersion }: SectionProps) {
  const editorRef = useRef<any>(null);
  const highlighterRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [themesRegistered, setThemesRegistered] = useState(false);

  const lightThemeName = 'tinte-light';
  const darkThemeName = 'tinte-dark';
  const currentThemeName = currentMode === 'dark' ? darkThemeName : lightThemeName;

  // Initialize Shiki highlighter
  useEffect(() => {
    let isMounted = true;

    async function initializeShiki() {
      try {
        if (!highlighterRef.current) {
          const highlighter = await createHighlighter({
            themes: [],
            langs: ['typescript', 'python', 'rust', 'go', 'javascript']
          });
          highlighterRef.current = highlighter;
        }

        if (isMounted) {
          setIsReady(true);
        }
      } catch (error) {
        console.error('Failed to initialize Shiki:', error);
        if (isMounted) {
          setIsReady(true);
        }
      }
    }

    initializeShiki();
    return () => { isMounted = false; };
  }, []);

  const registerThemes = useCallback(async (monaco: any) => {
    if (!highlighterRef.current || themesRegistered) return;

    try {
      // Register both light and dark themes
      const lightShikiTheme = {
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
      };

      const darkShikiTheme = {
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
      };

      await Promise.all([
        highlighterRef.current.loadTheme(lightShikiTheme),
        highlighterRef.current.loadTheme(darkShikiTheme)
      ]);

      shikiToMonaco(highlighterRef.current, monaco);
      setThemesRegistered(true);
      
      // Apply current theme
      const themeName = currentMode === 'dark' ? darkThemeName : lightThemeName;
      monaco.editor.setTheme(themeName);
      
      if (editorRef.current) {
        editorRef.current.updateOptions({ theme: themeName });
        const model = editorRef.current.getModel();
        if (model && (model as any)._tokenization) {
          (model as any)._tokenization.resetTokenization();
        }
        editorRef.current.layout();
      }
    } catch (error) {
      console.error('Failed to register themes:', error);
      applyFallbackThemes(monaco);
    }
  }, [themeSet, lightThemeName, darkThemeName, currentMode]);


  const applyFallbackThemes = useCallback((monaco: any) => {
    // Define fallback light theme
    const lightFallback = {
      base: 'vs' as const,
      inherit: true,
      rules: themeSet.light.tokenColors.map(token => {
        const scopes = Array.isArray(token.scope) ? token.scope : [token.scope];
        return scopes.map(scope => ({
          token: scope.replace(/\./g, ' '),
          foreground: token.settings.foreground?.replace('#', '') || '',
          fontStyle: token.settings.fontStyle || '',
        }));
      }).flat(),
      colors: themeSet.light.colors,
    };

    // Define fallback dark theme
    const darkFallback = {
      base: 'vs-dark' as const,
      inherit: true,
      rules: themeSet.dark.tokenColors.map(token => {
        const scopes = Array.isArray(token.scope) ? token.scope : [token.scope];
        return scopes.map(scope => ({
          token: scope.replace(/\./g, ' '),
          foreground: token.settings.foreground?.replace('#', '') || '',
          fontStyle: token.settings.fontStyle || '',
        }));
      }).flat(),
      colors: themeSet.dark.colors,
    };

    monaco.editor.defineTheme(lightThemeName, lightFallback);
    monaco.editor.defineTheme(darkThemeName, darkFallback);
    
    setThemesRegistered(true);
    
    // Apply current theme directly without calling switchToTheme
    const themeName = currentMode === 'dark' ? darkThemeName : lightThemeName;
    monaco.editor.setTheme(themeName);
    
    if (editorRef.current) {
      editorRef.current.updateOptions({ theme: themeName });
      const model = editorRef.current.getModel();
      if (model && (model as any)._tokenization) {
        (model as any)._tokenization.resetTokenization();
      }
      editorRef.current.layout();
    }
  }, [themeSet, lightThemeName, darkThemeName, currentMode]);

  const handleEditorDidMount = async (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Register languages
    const languages = ['typescript', 'python', 'rust', 'go'];
    languages.forEach(lang => {
      if (!monaco.languages.getLanguages().some((l: any) => l.id === lang)) {
        monaco.languages.register({ id: lang });
      }
    });

    // Register themes
    await registerThemes(monaco);
  };

  // Update theme when mode or version changes
  useEffect(() => {
    if (editorRef.current && isReady && themesRegistered) {
      const monaco = (window as any).monaco;
      if (monaco) {
        const themeName = currentMode === 'dark' ? darkThemeName : lightThemeName;
        try {
          monaco.editor.setTheme(themeName);
          
          if (editorRef.current) {
            editorRef.current.updateOptions({ theme: themeName });
            const model = editorRef.current.getModel();
            if (model && (model as any)._tokenization) {
              (model as any)._tokenization.resetTokenization();
            }
            editorRef.current.layout();
          }
        } catch (error) {
          console.warn(`Failed to switch to ${currentMode} theme:`, error);
        }
      }
    }
  }, [currentMode, isReady, themesRegistered, themeVersion, lightThemeName, darkThemeName]);

  // Re-register themes when theme set changes
  useEffect(() => {
    if (editorRef.current && isReady && !themesRegistered) {
      const monaco = (window as any).monaco;
      if (monaco) {
        registerThemes(monaco);
      }
    }
  }, [themeSet, isReady, themesRegistered, registerThemes]);

  // Reset theme registration when themeSet changes
  useEffect(() => {
    setThemesRegistered(false);
  }, [themeSet]);

  // Update template when it changes
  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        const monaco = (window as any).monaco;
        if (monaco) {
          monaco.editor.setModelLanguage(model, template.language);
        }
        editorRef.current.setValue(template.code);
      }
    }
  }, [template]);

  if (!isReady) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Loading Monaco...
      </div>
    );
  }

  return (
    <Editor
      height="100%"
      language={template.language}
      value={template.code}
      onMount={handleEditorDidMount}
      options={{
        readOnly: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 13,
        lineNumbers: 'on',
        glyphMargin: false,
        folding: false,
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 3,
        renderLineHighlight: 'none',
        automaticLayout: true,
        wordWrap: 'off',
        scrollbar: {
          vertical: 'auto',
          horizontal: 'auto',
        },
      }}
      theme={currentThemeName}
    />
  );
}

// Shiki Section
function ShikiSection({ themeSet, currentMode, template, themeVersion }: SectionProps) {
  const [html, setHtml] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const highlightCode = async () => {
      try {
        setLoading(true);

        const currentTheme = themeSet[currentMode];
        const shikiTheme = {
          name: `tinte-${currentMode}`,
          type: currentTheme.type,
          colors: {
            'editor.background': currentTheme.colors['editor.background'] || (currentMode === 'dark' ? '#1e1e1e' : '#ffffff'),
            'editor.foreground': currentTheme.colors['editor.foreground'] || (currentMode === 'dark' ? '#d4d4d4' : '#000000'),
            'editorLineNumber.foreground': currentTheme.colors['editorLineNumber.foreground'] || '#6a6a6a',
          },
          tokenColors: currentTheme.tokenColors.map(token => ({
            scope: token.scope,
            settings: {
              foreground: token.settings.foreground,
              fontStyle: token.settings.fontStyle,
            }
          }))
        };

        const result = await codeToHtml(template.code, {
          lang: template.language as any,
          theme: shikiTheme as any,
        });

        setHtml(result);
      } catch (error) {
        console.error('Failed to highlight code:', error);
        setHtml(`<pre><code>${template.code}</code></pre>`);
      } finally {
        setLoading(false);
      }
    };

    highlightCode();
  }, [template.code, template.language, themeSet, currentMode, themeVersion]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Loading Shiki...
      </div>
    );
  }

  const currentTheme = themeSet[currentMode];
  
  return (
    <div
      className="h-full overflow-auto text-sm leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        backgroundColor: currentTheme.colors['editor.background'],
        color: currentTheme.colors['editor.foreground'],
      }}
    />
  );
}

// Tokens Section
interface TokensSectionProps {
  theme: VSCodeTheme;
  mode: 'light' | 'dark';
}

function TokensSection({ theme, mode }: TokensSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
      {/* VS Code Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">VS Code Colors ({mode})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {Object.entries(theme.colors || {}).slice(0, 30).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2 p-2 rounded border text-sm">
                <div
                  className="w-4 h-4 rounded border border-gray-300 flex-shrink-0"
                  style={{ backgroundColor: value }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-xs font-medium">{key}</div>
                  <div className="font-mono text-xs text-muted-foreground">{value}</div>
                </div>
              </div>
            ))}
            {Object.keys(theme.colors || {}).length > 30 && (
              <div className="text-sm text-muted-foreground text-center py-2">
                ... and {Object.keys(theme.colors || {}).length - 30} more colors
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Token Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Token Colors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {(theme.tokenColors || []).slice(0, 20).map((token, index) => (
              <div key={index} className="flex items-center gap-2 p-2 rounded border text-sm">
                <div
                  className="w-4 h-4 rounded border border-gray-300 flex-shrink-0"
                  style={{ backgroundColor: token.settings.foreground || '#000000' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-xs">{token.name || 'Unnamed'}</div>
                  <div className="font-mono text-xs text-muted-foreground truncate">
                    {Array.isArray(token.scope) ? token.scope.join(', ') : token.scope}
                  </div>
                  {token.settings.fontStyle && (
                    <div className="font-mono text-xs text-blue-600">
                      Style: {token.settings.fontStyle}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {(theme.tokenColors || []).length > 20 && (
              <div className="text-sm text-muted-foreground text-center py-2">
                ... and {(theme.tokenColors || []).length - 20} more token rules
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Theme Info */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Theme Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-muted-foreground">Name</div>
              <div className="font-mono">{theme.name || 'Untitled Theme'}</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">Type</div>
              <div className="font-mono">{theme.type || 'unknown'}</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">Display Name</div>
              <div className="font-mono">{theme.displayName || theme.name || 'N/A'}</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">Colors Count</div>
              <div className="font-mono">{Object.keys(theme.colors || {}).length}</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">Token Rules</div>
              <div className="font-mono">{(theme.tokenColors || []).length}</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">UI Theme</div>
              <div className="font-mono">{theme.type === 'dark' ? 'vs-dark' : 'vs'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Raw Theme Data */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Raw Theme JSON</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs overflow-auto max-h-64 bg-muted p-4 rounded font-mono">
            {JSON.stringify(theme, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}