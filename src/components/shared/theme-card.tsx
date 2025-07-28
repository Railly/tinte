'use client';

import { motion } from 'motion/react';
import { Heart, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TweakCNIcon from '@/components/shared/icons/tweakcn';
import RaycastIcon from '@/components/shared/icons/raycast';

interface ThemeData {
  id: string;
  name: string;
  description: string;
  author: string;
  downloads: number;
  likes: number;
  views: number;
  createdAt: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  tags: string[];
  preview?: string;
}

interface ThemeCardProps {
  theme: ThemeData;
  index: number;
}

export function ThemeCard({ theme }: ThemeCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="group relative overflow-hidden rounded-lg border border-border/30 bg-background/80 backdrop-blur-sm hover:border-border/60 transition-all duration-300 hover:shadow-md cursor-pointer"
    >
      {/* Gradient background based on primary color */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary}22, ${theme.colors.accent}11)`
        }}
      />

      {/* Color preview strip */}
      <div className="absolute top-3 right-3 flex gap-1">
        {Object.values(theme.colors).map((color, i) => (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 rounded-full border border-white/20 shadow-sm"
            style={{ backgroundColor: color }}
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.2, delay: i * 0.02 }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header with icon */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <h3 className="font-medium text-foreground group-hover:text-primary transition-colors leading-tight">
                {theme.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {theme.description}
              </p>
            </div>
          </div>

          {/* Minimal tags */}
          <div className="flex flex-wrap gap-1.5">
            {theme.tags.slice(0, 2).map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="px-2 py-1 text-xs bg-muted/50 text-muted-foreground rounded-full border border-border/30"
              >
                {tag}
              </span>
            ))}
            {theme.tags.length > 2 && (
              <span className="px-2 py-1 text-xs text-muted-foreground/60">
                +{theme.tags.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Stats in minimal format */}
        <div className="flex items-center justify-between pt-2 border-t border-border/20">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <motion.div
              className="flex items-center gap-1.5"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Heart className="w-3 h-3" />
              {formatNumber(theme.likes)}
            </motion.div>
            <motion.div
              className="flex items-center gap-1.5"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Download className="w-3 h-3" />
              {formatNumber(theme.downloads)}
            </motion.div>
          </div>
          {theme.author && (
            <div className="flex items-center text-xs text-muted-foreground/70">
              {theme.author === 'tweakcn' ? (
                <TweakCNIcon className="w-4 h-4" />
              ) : theme.author === 'rayso' ? (
                <RaycastIcon className="w-4 h-4" />
              ) : (
                theme.author
              )}
            </div>
          )}
        </div>

        {/* Action on hover */}
        <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex gap-2">
            <Button size="sm" className="flex-1 h-8 text-xs">
              <Sparkles className="w-3 h-3 mr-1.5" />
              Open in Tinte
            </Button>
            <Button size="sm" variant="outline" className="h-8 px-2 text-xs !bg-secondary hover:brightness-110">
              View Details
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}