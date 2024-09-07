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
  IconEye,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { SignInDialog } from "./sign-in-dialog";
import { ThemeConfig } from "@/lib/core/types";
import { FEATURED_THEME_LOGOS, SHOWCASE_COLORS } from "@/lib/constants";
import { getThemeCategoryLabel, isThemeOwner } from "@/app/utils";
import { useThemeExport } from "@/lib/hooks/use-theme-export";
import IconRaycast from "@/public/logos/raycast.svg";
import { useBinaryTheme } from "@/lib/hooks/use-binary-theme";
import { ThemeCardOptions } from "./theme-card-options";
import { ShareThemeDialog } from "./share-theme-dialog";
import { toast } from "sonner";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const MotionCard = motion(Card);
const MotionButton = motion(Button);

interface ThemeCardProps {
  themes: ThemeConfig[];
  onUseTheme: () => void;
  isSelected: boolean;
  themeConfig: ThemeConfig;
  isTextareaFocused: boolean;
  updateThemeConfig?: (newConfig: Partial<ThemeConfig>) => void;
}

export const ThemeCard: React.FC<ThemeCardProps> = ({
  themes,
  onUseTheme,
  isSelected,
  themeConfig,
  isTextareaFocused,
  updateThemeConfig,
}) => {
  const router = useRouter();
  const { currentTheme } = useBinaryTheme();
  const { user } = useUser();
  const { loading, exportVSIX } = useThemeExport();
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);
  console.log({ isSelected, name: themeConfig.name });

  const handleDownloadTheme = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await exportVSIX(themeConfig, currentTheme === "dark");
  };

  const handleSignInOrEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      router.push(`/generator?theme=${themeConfig.name}`);
    } else {
      setIsSignInDialogOpen(true);
    }
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/t/${themeConfig.id}`);
  };

  const isOwner = isThemeOwner(user?.id, themeConfig);

  const updateThemeStatus = async (themeId: string, isPublic: boolean) => {
    try {
      toast.info(
        `Making ${themeConfig.displayName} ${isPublic ? "public" : "private"}`,
      );
      const response = await fetch(`/api/theme/${themeId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublic, userId: user?.id }),
      });

      toast.dismiss();
      if (!response.ok) {
        toast.error("Failed to update theme status");
        return;
      }
      toast.success(`Theme is now ${isPublic ? "public" : "private"}`);
      updateThemeConfig?.({ ...themeConfig, isPublic });
      router.refresh();
    } catch (error) {
      console.error("Error updating theme public status:", error);
      throw error;
    }
  };

  return (
    <MotionCard
      className={cn(
        "overflow-hidden cursor-pointer transition-all duration-300",
        isSelected
          ? "border-primary shadow-lg"
          : "border-transparent hover:border-accent",
        {
          "opacity-50 grayscale": isTextareaFocused && !isSelected,
        },
      )}
      onClick={onUseTheme}
      whileHover={{ scale: 1.02 }}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex h-10 relative">
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
              height: "calc(100% + 0.5rem)",
              marginTop: "-0.25rem",
              transition: { duration: 0.2 },
            }}
          />
        ))}
      </div>
      <div className="p-4 bg-background relative">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-foreground">
            {themeConfig.displayName}
          </h2>
          <ThemeCardOptions
            themeConfig={themeConfig}
            updateThemeConfig={updateThemeConfig}
            themes={themes}
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="secondary">
            {themeConfig.category === "user" && (
              <>
                {themeConfig.user?.image_url ? (
                  <img
                    src={themeConfig.user.image_url}
                    width={20}
                    height={20}
                    className="mr-2 rounded-full"
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
        </div>
        <div className="mt-4 flex gap-2">
          <MotionButton
            size="sm"
            className="flex-1"
            onClick={handleSignInOrEdit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconBrush className="mr-2 w-4 h-4" />
            Edit
          </MotionButton>
          <MotionButton
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={handleDownloadTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? (
              <IconLoading className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <IconDownload className="mr-2 w-4 h-4" />
                Download
              </>
            )}
          </MotionButton>
          <MotionButton
            variant="outline"
            size="sm"
            onClick={handlePreview}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconEye className="w-4 h-4" />
          </MotionButton>
          <ShareThemeDialog
            themeConfig={themeConfig}
            isOwner={isOwner}
            canNotEdit={!isOwner}
            updateThemeStatus={updateThemeStatus}
            justIcon
          />
        </div>
      </div>
      <SignInDialog
        open={isSignInDialogOpen}
        setOpen={setIsSignInDialogOpen}
        redirectUrl={`/generator?theme=${themeConfig.name}`}
      />
    </MotionCard>
  );
};
