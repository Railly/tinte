"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { themeAtom } from "@/lib/atoms";
import { Button } from "@/components/ui/button";
import { IconDownload, IconShare } from "@/components/ui/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeExport() {
  const theme = useAtomValue(themeAtom);

  const exportTheme = () => {
    const themeString = JSON.stringify(theme, null, 2);
    const blob = new Blob([themeString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tinte-theme.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex space-x-2">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button onClick={exportTheme}>
          <IconDownload className="mr-2 h-4 w-4" />
          Export Theme
        </Button>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <IconShare className="mr-2 h-4 w-4" />
              Share
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => console.log("Copy link")}>
              Copy Link
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Share on Twitter")}>
              Share on Twitter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
    </div>
  );
}
