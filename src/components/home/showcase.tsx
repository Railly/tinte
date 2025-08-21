'use client';

import { ArrowRight } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ThemeCard } from '@/components/shared/theme-card';
import TweakCNIcon from '@/components/shared/icons/tweakcn';
import RaycastIcon from '@/components/shared/icons/raycast';
import Logo from '@/components/shared/logo';
import { useState } from 'react';
import { extractTweakcnThemeData } from '@/utils/tweakcn-presets';
import { extractRaysoThemeData } from '@/utils/rayso-presets';
import { extractTinteThemeData } from '@/utils/tinte-presets';
import { useThemeContext } from '@/providers/theme';

export function Showcase() {
  const [activeTab, setActiveTab] = useState('tweakcn');
  const { currentMode, isDark, handleThemeSelect } = useThemeContext();

  // Static theme data for showcase (no SSR issues)
  const tweakcnThemes = extractTweakcnThemeData(isDark).map((themeData, index) => ({
    ...themeData,
    description: `Beautiful ${themeData.name.toLowerCase()} theme with carefully crafted color combinations`,
    author: "tweakcn",
    provider: "tweakcn" as const,
    downloads: 8000 + index * 500,
    likes: 400 + index * 50,
    views: 15000 + index * 2000,
    tags: [
      themeData.name.split(" ")[0].toLowerCase(),
      "modern",
      "preset",
      "community",
    ],
  }));

  const raysoThemes = extractRaysoThemeData(isDark).map((themeData, index) => ({
    ...themeData,
    description: `Beautiful ${themeData.name.toLowerCase()} theme from ray.so with carefully crafted color combinations`,
    author: "ray.so",
    provider: "rayso" as const,
    downloads: 6000 + index * 400,
    likes: 300 + index * 40,
    views: 12000 + index * 1500,
    tags: [themeData.name.toLowerCase(), "rayso", "modern", "community"],
  }));

  const tinteThemes = extractTinteThemeData(isDark).map((themeData, index) => ({
    ...themeData,
    description: `Stunning ${themeData.name.toLowerCase()} theme created by tinte with modern design principles`,
    author: "tinte",
    provider: "tinte" as const,
    downloads: 5000 + index * 350,
    likes: 250 + index * 35,
    views: 10000 + index * 1200,
    tags: [
      themeData.name.toLowerCase().split(" ")[0],
      "tinte",
      "premium",
      "design",
    ],
  }));



  return (
    <div className="w-full space-y-8 p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
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
              Explore what the community is crafting with Tinte.
            </p>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="bg-background h-auto -space-x-px p-0 shadow-xs rtl:space-x-reverse border rounded-sm w-full sm:w-auto">
              <TabsTrigger
                value="tweakcn"
                className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border-none py-2 px-3 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e text-xs gap-1.5 flex-1 sm:flex-initial"
              >
                <TweakCNIcon className="w-3 h-3" />
                tweakcn
              </TabsTrigger>
              <TabsTrigger
                value="rayso"
                className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border-none py-2 px-3 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e text-xs gap-1.5 flex-1 sm:flex-initial"
              >
                <RaycastIcon className="w-3 h-3" />
                ray.so
              </TabsTrigger>
              <TabsTrigger
                value="tinte"
                className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border-none py-2 px-3 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e text-xs gap-1.5 flex-1 sm:flex-initial"
              >
                <Logo size={12} />
                tinte
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Provider Content */}
      <div>
        {activeTab === 'tweakcn' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tweakcnThemes.slice(0, 8).map((theme, index) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                index={index}
                onThemeSelect={handleThemeSelect}
              />
            ))}
          </div>
        )}

        {activeTab === 'rayso' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {raysoThemes.slice(0, 8).map((theme, index) => (
              <ThemeCard key={theme.id} theme={theme} index={index} onThemeSelect={handleThemeSelect} />
            ))}
          </div>
        )}

        {activeTab === 'tinte' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tinteThemes.slice(0, 8).map((theme, index) => (
              <ThemeCard key={theme.id} theme={theme} index={index} onThemeSelect={handleThemeSelect} />
            ))}
          </div>
        )}
      </div>

      {/* Browse All Button */}
      <div className="flex justify-center pb-4">
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