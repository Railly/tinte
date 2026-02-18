"use client";

import { Copy, Download, ExternalLink } from "lucide-react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { makePolineFromTinte, polineRampHex } from "@/lib/theme";
import {
  exportTheme,
  getAvailableProviders,
  getPreviewableProviders,
} from "@tinte/providers";
import { cn } from "@/lib/utils";
import type { TinteTheme } from "@tinte/core";

interface ProviderExperimentTabsProps {
  theme: TinteTheme | null;
  className?: string;
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
  }
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

interface ProviderOutputDisplayProps {
  providerId: string;
  theme: TinteTheme;
  className?: string;
}

function ProviderOutputDisplay({
  providerId,
  theme,
  className,
}: ProviderOutputDisplayProps) {
  const [output, setOutput] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setIsLoading(true);
    setError(null);

    try {
      // Use export format for preview to show the actual output users will get
      const exported = exportTheme(providerId, theme);
      setOutput(exported?.content || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed");
    } finally {
      setIsLoading(false);
    }
  }, [providerId, theme]);

  const handleCopy = () => {
    if (output) {
      const content =
        typeof output === "string" ? output : JSON.stringify(output, null, 2);
      copyToClipboard(content);
    }
  };

  const handleDownload = () => {
    if (output) {
      try {
        const exportResult = exportTheme(providerId, theme);
        if (exportResult) {
          downloadFile(
            exportResult.content,
            exportResult.filename,
            exportResult.mimeType,
          );
        }
      } catch (err) {
        console.error("Export failed:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className={cn("p-4 text-center text-muted-foreground", className)}>
        Converting theme...
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("p-4 text-center text-destructive", className)}>
        Error: {error}
      </div>
    );
  }

  if (!output) {
    return (
      <div className={cn("p-4 text-center text-muted-foreground", className)}>
        No output generated
      </div>
    );
  }

  const displayContent =
    typeof output === "string" ? output : JSON.stringify(output, null, 2);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopy}
          className="h-8"
        >
          <Copy className="h-3 w-3 mr-1" />
          Copy
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleDownload}
          className="h-8"
        >
          <Download className="h-3 w-3 mr-1" />
          Download
        </Button>
      </div>

      <div className="bg-muted rounded-lg p-3 overflow-auto max-h-[400px]">
        <pre className="text-xs font-mono whitespace-pre-wrap">
          {displayContent}
        </pre>
      </div>
    </div>
  );
}

export function ProviderExperimentTabs({
  theme,
  className,
}: ProviderExperimentTabsProps) {
  const availableProviders = getAvailableProviders();
  const previewableProviders = getPreviewableProviders();

  // Group providers by category
  const providersByCategory = React.useMemo(() => {
    const categories: Record<string, any[]> = {};

    availableProviders.forEach((provider: any) => {
      const category = provider.meta.category;
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(provider);
    });

    return categories;
  }, [availableProviders]);

  const categoryOrder = ["ui", "editor", "terminal", "design", "other"];
  const orderedCategories = categoryOrder.filter(
    (cat) => providersByCategory[cat],
  );

  if (!theme) {
    return (
      <div className={cn("text-center text-muted-foreground p-8", className)}>
        Select a theme to see provider transformations
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-sm text-muted-foreground">
        Experimenting with theme transformations across{" "}
        {availableProviders.length} providers
      </div>

      <Tabs defaultValue={orderedCategories[0]} className="w-full">
        <TabsList
          className="grid w-full"
          style={{
            gridTemplateColumns: `repeat(${orderedCategories.length}, 1fr)`,
          }}
        >
          {orderedCategories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="text-xs capitalize"
            >
              {category} ({providersByCategory[category].length})
            </TabsTrigger>
          ))}
        </TabsList>

        {orderedCategories.map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {providersByCategory[category].map((provider: any) => {
                const isPreviewable = previewableProviders.some(
                  (p: any) => p.meta.id === provider.meta.id,
                );

                return (
                  <Card key={provider.meta.id} className="h-fit">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        {provider.meta.icon && (
                          <provider.meta.icon className="h-4 w-4" />
                        )}
                        <CardTitle className="text-sm">
                          {provider.meta.name}
                        </CardTitle>
                        {isPreviewable && (
                          <Badge variant="secondary" className="text-xs">
                            Preview
                          </Badge>
                        )}
                      </div>
                      {provider.meta.description && (
                        <CardDescription className="text-xs">
                          {provider.meta.description}
                        </CardDescription>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {provider.meta.tags.map((tag: string) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-[10px] h-5"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ProviderOutputDisplay
                        providerId={provider.metadata.id}
                        theme={theme}
                      />

                      {provider.metadata.website && (
                        <div className="mt-3 pt-3 border-t">
                          <Button
                            size="sm"
                            variant="ghost"
                            asChild
                            className="h-7 px-2 text-xs"
                          >
                            <a
                              href={provider.metadata.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Website
                            </a>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Special Poline Section */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            🎨 Poline Transformation Preview
          </CardTitle>
          <CardDescription className="text-xs">
            Generated color ramps using Poline interpolation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {["light", "dark"].map((mode) => {
              const block = theme[mode as keyof TinteTheme];
              const poline = makePolineFromTinte(block as any);
              const ramp = polineRampHex(poline);

              return (
                <div key={mode} className="space-y-2">
                  <div className="text-xs font-medium capitalize">
                    {mode} Mode
                  </div>
                  <div className="grid grid-cols-11 gap-1">
                    {ramp.map((color, i) => (
                      <div
                        key={i}
                        className="h-8 rounded-sm border cursor-pointer"
                        style={{ backgroundColor: color }}
                        title={`${color} (${i})`}
                        onClick={() => copyToClipboard(color)}
                      />
                    ))}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Click any color to copy • {ramp.length} interpolated colors
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
