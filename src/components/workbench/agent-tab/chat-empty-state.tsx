"use client";

import { Sparkles } from "lucide-react";
import Logo from "@/components/shared/logo";
import { CHAT_SUGGESTIONS } from "./constants";

interface ChatEmptyStateProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function ChatEmptyState({ onSuggestionClick }: ChatEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center max-w-lg mx-auto">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center border border-border/30">
          <Logo size={32} />
        </div>
        <div className="absolute top-2 -right-2 w-6 h-6">
          <Sparkles className="h-3 w-3 text-foreground" />
        </div>
      </div>

      <h3 className="text-lg font-medium text-foreground mb-2">
        What can I help you craft?
      </h3>
      <p className="text-sm text-muted-foreground mb-8 max-w-xs">
        Describe your vision and I'll generate the perfect theme
      </p>

      <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
        {CHAT_SUGGESTIONS.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="p-3 text-left rounded-lg border border-border/40 hover:border-border hover:bg-accent/20 transition-all duration-200 group text-sm text-muted-foreground hover:text-foreground"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
