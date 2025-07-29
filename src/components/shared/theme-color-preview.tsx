'use client';

interface ThemeColorPreviewProps {
  colors: Record<string, string>;
  maxColors?: number;
  className?: string;
}

export function ThemeColorPreview({ 
  colors, 
  maxColors = 5,
  className = ""
}: ThemeColorPreviewProps) {
  const colorEntries = Object.entries(colors).filter(([_, value]) => value && value.startsWith('#'));
  const displayColors = colorEntries.slice(0, maxColors);

  return (
    <div className={`flex gap-0.5 ${className}`}>
      {displayColors.map(([name, color], index) => (
        <div
          key={index}
          className="w-4 h-4 rounded-sm border border-border/20"
          style={{ backgroundColor: color }}
          title={`${name}: ${color}`}
        />
      ))}
    </div>
  );
}