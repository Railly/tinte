'use client';

import { useState } from 'react';
import { useThemeStore } from '@/lib/stores/theme-store';
import { toggleThemePublicAction, deleteThemeAction } from '@/lib/actions/theme-actions';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { MoreHorizontal, Eye, EyeOff, Edit, Trash2 } from 'lucide-react';
import type { Theme } from '@/lib/db/schema';

interface ThemeCardProps {
  theme: Theme;
  isOwner: boolean;
}

export function ThemeCard({ theme, isOwner }: ThemeCardProps) {
  const { setSelectedTheme, startEditing } = useThemeStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = () => {
    setSelectedTheme(theme);
  };

  const handleEdit = () => {
    startEditing(theme);
  };

  const handleTogglePublic = async () => {
    setIsLoading(true);
    try {
      await toggleThemePublicAction(theme.id, !theme.public);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this theme?')) {
      setIsLoading(true);
      try {
        await deleteThemeAction(theme.id);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{theme.name}</CardTitle>
            {theme.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {theme.description}
              </p>
            )}
          </div>

          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isLoading}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleTogglePublic}>
                  {theme.public ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Make Private
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Make Public
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex gap-2">
          {theme.public && <Badge variant="secondary">Public</Badge>}
          {isOwner && <Badge variant="outline">Your Theme</Badge>}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Theme preview - could show color swatches or preview */}
        <div className="h-20 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 mb-3">
          {/* This would be replaced with actual theme preview */}
        </div>

        <p className="text-xs text-muted-foreground">
          Created {new Date(theme.createdAt).toLocaleDateString()}
        </p>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          onClick={handleSelect}
          className="w-full"
          disabled={isLoading}
        >
          Preview Theme
        </Button>
      </CardFooter>
    </Card>
  );
}