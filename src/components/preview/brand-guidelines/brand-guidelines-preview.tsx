import { ScrollArea } from "@/components/ui/scroll-area";
import type { BrandGuidelinesOutput } from "@/lib/providers/brand-guidelines";
import { useThemeContext } from "@/providers/theme";

interface BrandGuidelinesPreviewProps {
  theme: BrandGuidelinesOutput;
  className?: string;
}

export function BrandGuidelinesPreview({
  theme,
  className,
}: BrandGuidelinesPreviewProps) {
  // Use the canonical theme name from the theme object
  console.log({ theme });
  const themeName = theme.brand.name;
  return (
    <div className={`h-full bg-background ${className}`}>
      <ScrollArea className="h-full w-full">
        <div className="p-4 md:p-6 space-y-6 max-w-full">
          {/* Header */}
          <div className="space-y-3 pb-4 border-b">
            <h1
              className="text-2xl md:text-3xl font-bold break-words"
              style={{ fontFamily: theme.typography.primary.family }}
            >
              Brand Guidelines
            </h1>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              {theme.brand.description}
            </p>
          </div>

          {/* Primary Logo Section */}
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Primary Logo</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {theme.logo.primary}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {theme.logo.variations.map((variant, i) => (
                <div key={i} className="border rounded-lg p-3 md:p-4 space-y-3">
                  <div
                    className="aspect-video rounded-md flex items-center justify-center min-h-[120px]"
                    style={{ backgroundColor: variant.background }}
                  >
                    <div
                      className="flex items-center gap-2 text-lg md:text-xl font-semibold"
                      style={{
                        color: variant.logo,
                        fontFamily: theme.typography.primary.family,
                      }}
                    >
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center relative">
                        <div className="w-4 h-4 md:w-6 md:h-6 rounded-full border-2 border-current opacity-60" />
                        <div className="absolute w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-current" />
                      </div>
                      {themeName.toLowerCase()}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm md:text-base">
                      {variant.name}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {variant.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Symbol Section */}
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Symbol</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {theme.symbol.description}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {theme.symbol.variations.map((variant, i) => (
                <div key={i} className="border rounded-lg p-3 md:p-4 space-y-3">
                  <div
                    className="aspect-square rounded-md flex items-center justify-center min-h-[80px]"
                    style={{ backgroundColor: variant.background }}
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center relative">
                      <div
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 opacity-60"
                        style={{ borderColor: variant.color }}
                      />
                      <div
                        className="absolute w-2.5 h-2.5 md:w-3 md:h-3 rounded-full"
                        style={{ backgroundColor: variant.color }}
                      />
                    </div>
                  </div>
                  <h3 className="font-medium text-center text-sm md:text-base">
                    {variant.name}
                  </h3>
                </div>
              ))}
            </div>
          </section>

          {/* Logo Scaling Section */}
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Logo Scaling</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {theme.scaling.description}
              </p>
            </div>

            <div className="border rounded-lg p-4 md:p-6 bg-muted/20">
              <div className="flex flex-wrap items-end gap-4 md:gap-8 justify-center">
                {theme.scaling.sizes.map((size, i) => (
                  <div key={i} className="text-center space-y-2 flex-shrink-0">
                    <div
                      className="flex items-center gap-1 text-foreground font-semibold whitespace-nowrap"
                      style={{
                        fontSize: `${Math.max(size.percentage * 0.18, 0.6)}rem`,
                        fontFamily: theme.typography.primary.family,
                      }}
                    >
                      <div
                        className={`rounded-full flex items-center justify-center relative flex-shrink-0 ${size.percentage < 50 ? "w-2.5 h-2.5" : size.percentage < 75 ? "w-3 h-3" : "w-4 h-4"}`}
                      >
                        <div className="w-full h-full rounded-full border border-current opacity-60" />
                        <div className="absolute w-0.5 h-0.5 md:w-1 md:h-1 rounded-full bg-current" />
                      </div>
                      {themeName.toLowerCase()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <div className="font-medium">{size.percentage}%</div>
                      <div className="text-[10px] leading-tight">
                        {size.usage}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Typography Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Typography</h2>

            <div className="border rounded-lg p-4 md:p-6 space-y-4">
              <div>
                <h3 className="font-medium mb-3 text-sm md:text-base">
                  {theme.typography.primary.name}
                </h3>
                <div className="space-y-3">
                  <div
                    className="text-2xl md:text-3xl leading-tight break-words"
                    style={{ fontFamily: theme.typography.primary.family }}
                  >
                    {theme.typography.primary.name}
                  </div>
                  <div
                    className="text-xs md:text-sm text-muted-foreground whitespace-pre-line tracking-wide leading-relaxed overflow-hidden"
                    style={{ fontFamily: theme.typography.primary.family }}
                  >
                    {theme.typography.primary.sample}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Primary Colour Section */}
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Primary Colour</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {theme.colors.primary.description}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {theme.colors.primary.palette.map((color, i) => (
                <div key={i} className="space-y-2">
                  <div
                    className="aspect-square rounded-lg border min-h-[60px]"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="space-y-1">
                    <div className="font-medium text-xs md:text-sm break-words">
                      {color.name}
                    </div>
                    <div className="font-mono text-[10px] md:text-xs text-muted-foreground break-all">
                      {color.hex}
                    </div>
                    <div className="text-[10px] md:text-xs text-muted-foreground leading-tight">
                      {color.usage}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Neutral Colors Section */}
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Neutral Colors</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {theme.colors.neutral.description}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {theme.colors.neutral.palette.map((color, i) => (
                <div key={i} className="space-y-2">
                  <div
                    className="aspect-square rounded-lg border min-h-[60px]"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="space-y-1">
                    <div className="font-medium text-xs md:text-sm break-words">
                      {color.name}
                    </div>
                    <div className="font-mono text-[10px] md:text-xs text-muted-foreground break-all">
                      {color.hex}
                    </div>
                    <div className="text-[10px] md:text-xs text-muted-foreground leading-tight">
                      {color.usage}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
}
