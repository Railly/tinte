'use client';

interface ThemeColorPreviewProps {
  colors: Record<string, string>;
  maxColors?: number;
  className?: string;
  size?: 'sm' | 'md';
}

export function ThemeColorPreview({ 
  colors, 
  maxColors = 5,
  className = "",
  size = 'md'
}: ThemeColorPreviewProps) {
  const colorEntries = Object.entries(colors).filter(([_, value]) => value && value.startsWith('#'));
  const displayColors = colorEntries.slice(0, maxColors);
  
  const sizeClasses = size === 'sm' ? 'w-3 h-2' : 'w-4 h-4';
  const gapClasses = size === 'sm' ? 'gap-0.5' : 'gap-0.5';

  return (
    <div className={`flex ${gapClasses} ${className}`}>
      {displayColors.map(([name, color], index) => (
        <div
          key={index}
          className={`${sizeClasses} rounded-sm border border-border/20`}
          style={{ backgroundColor: color }}
          title={`${name}: ${color}`}
        />
      ))}
    </div>
  );
}