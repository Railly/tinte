'use client';

import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { MoreHorizontal, Eye, EyeOff, Trash2, Edit, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeCardActions } from '@/hooks/use-theme-card-actions';
import type { Theme } from '@/lib/db/schema';

interface ThemeCardProps {
  theme: Theme;
  isOwner: boolean;
}

export function ThemeCard({ theme, isOwner }: ThemeCardProps) {
  const {
    optimisticTheme,
    isPending,
    handleSelect,
    handleEdit,
    handleTogglePublic,
    handleDelete,
  } = useThemeCardActions(theme);

  if (optimisticTheme.deleted) {
    return null;
  }

  return (
    <Card className={cn(
      "group hover:shadow-md transition-all",
      isPending && "opacity-50",
      optimisticTheme.deleteFailed && "ring-2 ring-destructive/20 bg-destructive/5"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{optimisticTheme.name}</CardTitle>
            {optimisticTheme.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {optimisticTheme.description}
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
                  disabled={isPending}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit} disabled={isPending}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleTogglePublic} disabled={isPending}>
                  {optimisticTheme.public ? (
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
                  disabled={isPending}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex gap-2">
          {optimisticTheme.public && <Badge variant="secondary">Public</Badge>}
          {isOwner && <Badge variant="outline">Your Theme</Badge>}
          {optimisticTheme.deleteFailed && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Delete failed
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Theme preview - could show color swatches or preview */}
        <div className="h-20 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 mb-3">
          {/* This would be replaced with actual theme preview */}
        </div>

        <p className="text-xs text-muted-foreground">
          Created {new Date(optimisticTheme.createdAt).toLocaleDateString()}
        </p>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          onClick={handleSelect}
          className="w-full"
          disabled={isPending}
        >
          Preview Theme
        </Button>
      </CardFooter>
    </Card>
  );
}