import { X } from "lucide-react";
import { motion } from "motion/react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DockInfoProps {
  onCollapse: () => void;
  providerMetadata?: {
    icon?: React.ComponentType<{ className?: string }>;
    name: string;
    description?: string;
    category: string;
    tags: string[];
  };
  provider?: {
    fileExtension: string;
  };
  exportedTheme?: {
    content: string;
  };
  formatFileSize: (content: string) => string;
}

export function DockInfo({
  onCollapse,
  providerMetadata,
  provider,
  exportedTheme,
  formatFileSize,
}: DockInfoProps) {
  return (
    <motion.div
      key="info"
      initial={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ type: "spring", bounce: 0.25, delay: 0.1 }}
      className="p-4 relative"
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 w-6 h-6 bg-transparent hover:bg-white/10 border-0 text-white/60 hover:text-white rounded-full transition-colors"
        onClick={onCollapse}
      >
        <X className="w-3 h-3" />
      </Button>

      {providerMetadata && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {providerMetadata.icon &&
              React.createElement(providerMetadata.icon, {
                className: "w-5 h-5 text-white",
              })}
            <h3 className="text-white font-medium text-sm">
              {providerMetadata.name}
            </h3>
          </div>

          {providerMetadata.description && (
            <p className="text-white/70 text-xs leading-relaxed">
              {providerMetadata.description}
            </p>
          )}

          <div className="flex flex-wrap gap-1">
            <Badge
              variant="secondary"
              className="text-xs bg-white/10 text-white/80 border-white/20"
            >
              {providerMetadata.category}
            </Badge>
            {providerMetadata.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs bg-transparent text-white/60 border-white/20"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {exportedTheme && (
            <div className="bg-white/5 rounded-lg p-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-white/60">Format:</span>
                <code className="text-white/80">
                  .{provider?.fileExtension}
                </code>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/60">Size:</span>
                <span className="text-white/80">
                  {formatFileSize(exportedTheme.content)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
