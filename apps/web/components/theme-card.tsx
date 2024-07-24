/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  IconBrush,
  IconCheck,
  IconDownload,
  IconGlobe,
  IconLoading,
  IconLock,
  IconTinte,
  IconUser,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { SignInDialog } from "./sign-in-dialog";
import { ThemeConfig } from "@/lib/core/types";
import { FEATURED_THEME_LOGOS, SHOWCASE_COLORS } from "@/lib/constants";
import { getThemeCategoryLabel } from "@/app/utils";
import { useThemeExport } from "@/lib/hooks/use-theme-export";
import IconRaycast from "@/public/logos/raycast.svg";
import { useBinaryTheme } from "@/lib/hooks/use-binary-theme";
import { ThemeCardOptions } from "./theme-card-options";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const MotionCard = motion(Card);
const MotionButton = motion(Button);

interface ThemeCardProps {
  onUseTheme: () => void;
  isSelected: boolean;
  themeConfig: ThemeConfig;
  isTextareaFocused: boolean;
}

export const ThemeCard: React.FC<ThemeCardProps> = ({
  onUseTheme,
  isSelected,
  themeConfig,
  isTextareaFocused,
}) => {
  const router = useRouter();
  const { currentTheme } = useBinaryTheme();
  const user = useUser();
  const { loading, exportVSIX } = useThemeExport();
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);

  const handleDownloadTheme = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await exportVSIX(themeConfig, currentTheme === "dark");
  };

  const handleSignInOrEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user.isSignedIn) {
      router.push(`/generator?theme=${themeConfig.name}`);
    } else {
      setIsSignInDialogOpen(true);
    }
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <MotionCard
        className={cn(
          "overflow-hidden cursor-pointer transition-all duration-300",
          isSelected
            ? "border-primary shadow-lg"
            : "border-transparent hover:border-accent",
          {
            "opacity-50 grayscale": isTextareaFocused && !isSelected,
          }
        )}
        onClick={onUseTheme}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div className="flex h-10 relative" variants={itemVariants}>
          {SHOWCASE_COLORS.map((colorKey, index) => (
            <motion.div
              key={colorKey}
              className="flex-1 h-full"
              style={{
                backgroundColor:
                  themeConfig.palette[currentTheme]?.[
                    colorKey as keyof typeof themeConfig.palette.light
                  ],
                zIndex: SHOWCASE_COLORS.length - index,
              }}
              whileHover={{
                height: "calc(100% + 1rem)",
                marginTop: "-0.5rem",
                transition: { duration: 0.2 },
              }}
            />
          ))}
        </motion.div>
        <div className="p-4 bg-background relative">
          <div className="flex justify-between items-start mb-2">
            <motion.h2
              className="text-lg font-semibold text-foreground"
              variants={itemVariants}
            >
              {themeConfig.displayName}
            </motion.h2>
            <ThemeCardOptions themeConfig={themeConfig} />
          </div>
          <motion.div
            className="flex flex-wrap gap-2 mt-2"
            variants={itemVariants}
          >
            <Badge variant="secondary">
              {themeConfig.category === "user" && (
                <>
                  {themeConfig.user?.image_url ? (
                    <img
                      src={themeConfig.user?.image_url}
                      className="w-5 h-5 mr-2 rounded-full"
                      alt={themeConfig.user?.username || "User"}
                    />
                  ) : (
                    <IconUser className="w-4 h-4 mr-2" />
                  )}
                  {themeConfig.user?.username || "Anonymous"}
                </>
              )}
              {themeConfig.category === "community" && (
                <IconTinte className="w-4 h-4 mr-2" />
              )}
              {themeConfig.category === "rayso" && (
                <IconRaycast className="w-4 h-4 mr-2" />
              )}
              {themeConfig.category === "featured" && (
                <div className="mr-2">
                  {
                    FEATURED_THEME_LOGOS[
                      themeConfig.displayName as keyof typeof FEATURED_THEME_LOGOS
                    ]
                  }
                </div>
              )}
              {themeConfig.category !== "user" &&
                getThemeCategoryLabel(themeConfig.category)}
            </Badge>
            <Badge variant="outline">
              {themeConfig.isPublic ? (
                <IconGlobe className="w-4 h-4 mr-2 text-cyan-700 dark:text-cyan-400" />
              ) : (
                <IconLock className="w-3 h-3 mr-2 text-rose-600 dark:text-rose-400" />
              )}
              {themeConfig.isPublic ? "Public" : "Private"}
            </Badge>
            {isSelected && (
              <Badge
                variant="default"
                className="bg-primary text-primary-foreground"
              >
                <IconCheck className="w-3.5 h-3.5" />
              </Badge>
            )}
          </motion.div>
          <motion.div variants={itemVariants} className="mt-4 space-x-2 flex">
            <MotionButton
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleSignInOrEdit}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconBrush className="mr-2 w-4 h-4" />
              Customize
            </MotionButton>
            <MotionButton
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleDownloadTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              {loading ? (
                <span className="animate-spin">
                  <IconLoading className="mr-2 w-4 h-4" />
                </span>
              ) : (
                <IconDownload className="mr-2 w-4 h-4" />
              )}
              Download
            </MotionButton>
          </motion.div>
        </div>
      </MotionCard>
      <SignInDialog
        open={isSignInDialogOpen}
        setOpen={setIsSignInDialogOpen}
        redirectUrl={`/generator?theme=${themeConfig.name}`}
      />
    </motion.div>
  );
};
