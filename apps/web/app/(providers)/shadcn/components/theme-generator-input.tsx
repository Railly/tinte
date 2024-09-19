"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  IconSparkles,
  IconGenerate,
  IconRandom,
  IconLoading,
} from "@/components/ui/icons";
import { ThemePresetSelector } from "./theme-preset-selector";
import { Theme } from "@/lib/atoms";
import { ShadcnThemes } from "@prisma/client";

const MAX_CHARS = 200;

interface ThemeGeneratorInputProps {
  description: string;
  setDescription: (description: string) => void;
  onGenerate: () => void;
  onRandom: () => void;
  onEnhance: () => void;
  isGenerating: boolean;
  isEnhancing: boolean;
  onSelectPreset: (preset: Theme) => void;
  currentTheme: Theme;
  allThemes: ShadcnThemes[];
}

export function ThemeGeneratorInput({
  description,
  setDescription,
  onGenerate,
  onRandom,
  onEnhance,
  isGenerating,
  isEnhancing,
  onSelectPreset,
  currentTheme,
  allThemes,
}: ThemeGeneratorInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col items-center justify-center space-y-6 p-6"
    >
      <div className="border rounded-md w-full md:max-w-lg">
        <div className="flex justify-between items-center p-2 rounded-t-md bg-card text-card-foreground border-b">
          <h2 className="text-sm font-bold">Theme Generator</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onRandom}>
              <IconRandom className="w-4 h-4 mr-2" />
              <span>Random</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onGenerate}
              disabled={description.trim().length < 3 || isGenerating}
            >
              {isGenerating ? (
                <IconLoading className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <IconGenerate className="w-4 h-4 mr-2" />
              )}
              <span>{isGenerating ? "Generating..." : "Generate"}</span>
            </Button>
          </div>
        </div>

        <div className="p-2 space-y-4">
          <ThemePresetSelector
            currentTheme={currentTheme}
            onSelectPreset={onSelectPreset}
            allThemes={allThemes}
          />
          <div className="relative">
            <Textarea
              placeholder="Describe your theme here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none w-full !h-32 !pb-10"
              minLength={3}
              maxLength={MAX_CHARS}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onEnhance}
              className="absolute bottom-4 left-4 text-muted-foreground hover:text-foreground"
              disabled={description.trim().length < 3 || isEnhancing}
            >
              {isEnhancing ? (
                <IconLoading className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <IconSparkles className="w-4 h-4 mr-1" />
              )}
              {isEnhancing ? "Enhancing..." : "Enhance"}
            </Button>
            <span className="absolute bottom-4 right-4 text-muted-foreground text-sm">
              {description.length}/{MAX_CHARS}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
