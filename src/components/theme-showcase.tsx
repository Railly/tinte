'use client';

import { ArrowRight } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ThemeCard } from '@/components/theme-card';
import TweakCNIcon from '@/components/shared/icons/tweakcn';
import RaycastIcon from '@/components/shared/icons/raycast';
import Logo from '@/components/shared/logo';

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
}

const INITIAL_THEMES: ThemeData[] = [
  {
    id: '1',
    name: 'Ocean Depths',
    description: 'A calming blue theme inspired by deep ocean waters with sophisticated gradients',
    author: 'Maria Chen',
    downloads: 12500,
    likes: 890,
    views: 45200,
    createdAt: '2024-01-15',
    colors: {
      primary: '#0ea5e9',
      secondary: '#0284c7',
      accent: '#06b6d4',
      background: '#f8fafc',
      foreground: '#0f172a'
    },
    tags: ['blue', 'ocean', 'professional', 'modern']
  },
  {
    id: '2',
    name: 'Forest Canopy',
    description: 'Natural green tones that bring the tranquility of nature to your interface',
    author: 'Alex Rivera',
    downloads: 8900,
    likes: 654,
    views: 32100,
    createdAt: '2024-01-12',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399',
      background: '#fefefe',
      foreground: '#1f2937'
    },
    tags: ['green', 'nature', 'eco', 'calm']
  },
  {
    id: '3',
    name: 'Sunset Blaze',
    description: 'Warm orange and red tones capturing the energy of a beautiful sunset',
    author: 'Sam Johnson',
    downloads: 15600,
    likes: 1200,
    views: 67800,
    createdAt: '2024-01-10',
    colors: {
      primary: '#f97316',
      secondary: '#ea580c',
      accent: '#fb923c',
      background: '#fffbeb',
      foreground: '#1c1917'
    },
    tags: ['orange', 'warm', 'energetic', 'sunset']
  },
  {
    id: '4',
    name: 'Purple Magic',
    description: 'Mystical purple shades with modern gradients for creative interfaces',
    author: 'Jordan Park',
    downloads: 11200,
    likes: 780,
    views: 41500,
    createdAt: '2024-01-08',
    colors: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      accent: '#a78bfa',
      background: '#faf5ff',
      foreground: '#1e1b4b'
    },
    tags: ['purple', 'magic', 'creative', 'modern']
  },
  {
    id: '5',
    name: 'Rose Garden',
    description: 'Elegant pink tones with soft romantic touches for delicate designs',
    author: 'Taylor Swift',
    downloads: 9800,
    likes: 920,
    views: 38700,
    createdAt: '2024-01-05',
    colors: {
      primary: '#ec4899',
      secondary: '#db2777',
      accent: '#f472b6',
      background: '#fdf2f8',
      foreground: '#881337'
    },
    tags: ['pink', 'romantic', 'elegant', 'soft']
  },
  {
    id: '6',
    name: 'Steel Framework',
    description: 'Industrial gray palette perfect for professional and technical interfaces',
    author: 'Casey Morgan',
    downloads: 14300,
    likes: 567,
    views: 55200,
    createdAt: '2024-01-03',
    colors: {
      primary: '#6b7280',
      secondary: '#4b5563',
      accent: '#9ca3af',
      background: '#f9fafb',
      foreground: '#111827'
    },
    tags: ['gray', 'professional', 'minimal', 'clean']
  },
  {
    id: '7',
    name: 'Midnight Blue',
    description: 'Deep navy tones with electric accents for sophisticated dark interfaces',
    author: 'Chris Lee',
    downloads: 13700,
    likes: 845,
    views: 52300,
    createdAt: '2024-01-20',
    colors: {
      primary: '#1e40af',
      secondary: '#1e3a8a',
      accent: '#3b82f6',
      background: '#0f172a',
      foreground: '#e2e8f0'
    },
    tags: ['dark', 'navy', 'electric', 'sophisticated']
  },
  {
    id: '8',
    name: 'Coral Reef',
    description: 'Vibrant coral and teal combination inspired by underwater ecosystems',
    author: 'Dana Kim',
    downloads: 10500,
    likes: 720,
    views: 41200,
    createdAt: '2024-01-18',
    colors: {
      primary: '#f472b6',
      secondary: '#ec4899',
      accent: '#06b6d4',
      background: '#fef7f0',
      foreground: '#1f2937'
    },
    tags: ['coral', 'vibrant', 'underwater', 'tropical']
  },
  {
    id: '9',
    name: 'Golden Hour',
    description: 'Warm yellows and amber tones capturing the magic of golden hour light',
    author: 'Riley Adams',
    downloads: 11800,
    likes: 890,
    views: 46500,
    createdAt: '2024-01-16',
    colors: {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#fbbf24',
      background: '#fffbeb',
      foreground: '#1c1917'
    },
    tags: ['yellow', 'golden', 'warm', 'magical']
  },
  {
    id: '10',
    name: 'Arctic Frost',
    description: 'Cool mint and ice blue palette for clean, fresh interfaces',
    author: 'Morgan Taylor',
    downloads: 9200,
    likes: 612,
    views: 35800,
    createdAt: '2024-01-14',
    colors: {
      primary: '#06b6d4',
      secondary: '#0891b2',
      accent: '#67e8f9',
      background: '#f0fdfa',
      foreground: '#134e4a'
    },
    tags: ['mint', 'ice', 'cool', 'fresh']
  },
  {
    id: '11',
    name: 'Ember Glow',
    description: 'Fiery reds and oranges with subtle gradients for energetic designs',
    author: 'Phoenix Chen',
    downloads: 14900,
    likes: 1050,
    views: 58700,
    createdAt: '2024-01-11',
    colors: {
      primary: '#dc2626',
      secondary: '#b91c1c',
      accent: '#f87171',
      background: '#fef2f2',
      foreground: '#1f2937'
    },
    tags: ['red', 'fire', 'energetic', 'bold']
  },
  {
    id: '12',
    name: 'Sage Wisdom',
    description: 'Muted green and brown earth tones for calm, natural interfaces',
    author: 'River Stone',
    downloads: 8600,
    likes: 543,
    views: 33400,
    createdAt: '2024-01-09',
    colors: {
      primary: '#65a30d',
      secondary: '#4d7c0f',
      accent: '#84cc16',
      background: '#f7fee7',
      foreground: '#365314'
    },
    tags: ['sage', 'earth', 'natural', 'muted']
  }
];

export function ThemeShowcase() {
  const displayedThemes = INITIAL_THEMES;


  return (
    <div className="w-full space-y-8 p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <h2 className="text-xl font-medium">From the Community</h2>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            Explore what the community is building with themes.
          </p>
        </div>
        <Tabs defaultValue="tweakcn" className="w-fit">
          <TabsList className="h-9">
            <TabsTrigger value="tweakcn" className="text-xs h-7 gap-1.5">
              <TweakCNIcon className="w-3 h-3" />
              tweakcn
            </TabsTrigger>
            <TabsTrigger value="rayso" className="text-xs h-7 gap-1.5">
              <RaycastIcon className="w-3 h-3" />
              ray.so
            </TabsTrigger>
            <TabsTrigger value="community" className="text-xs h-7 gap-1.5">
              <Logo size={12} />
              community
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Provider Content */}
      <div>
        <Tabs defaultValue="tweakcn" className="w-full">
          <TabsList className="hidden">
            <TabsTrigger value="tweakcn">tweakcn</TabsTrigger>
            <TabsTrigger value="rayso">ray.so</TabsTrigger>
            <TabsTrigger value="community">community</TabsTrigger>
          </TabsList>

          {/* TweakCN */}
          <TabsContent value="tweakcn" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayedThemes.slice(0, 8).map((theme, index) => (
                <ThemeCard key={theme.id} theme={{...theme, id: `tweakcn-${theme.id}`}} index={index} />
              ))}
            </div>
          </TabsContent>

          {/* Ray.so */}
          <TabsContent value="rayso" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayedThemes.slice(0, 8).map((theme, index) => (
                <ThemeCard key={theme.id} theme={{...theme, id: `rayso-${theme.id}`}} index={index} />
              ))}
            </div>
          </TabsContent>

          {/* Community */}
          <TabsContent value="community" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayedThemes.slice(0, 8).map((theme, index) => (
                <ThemeCard key={theme.id} theme={{...theme, id: `community-${theme.id}`}} index={index} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Browse All Button */}
      <div className="flex justify-center pt-8">
        <Button
          variant="outline"
          className="gap-2 h-10 px-6"
          onClick={() => console.log('Browse all themes')}
        >
          Browse All Themes
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}