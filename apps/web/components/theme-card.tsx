import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconCheck, IconEdit, IconTrash } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { SignInDialog } from "./sign-in-dialog";

interface ThemeCardProps {
  showcaseColors: string[];
  featuredTheme: {
    dark: Record<string, string>;
    light: Record<string, string>;
  };
  nextTheme: string | undefined;
  displayName: string;
  onUseTheme: () => void;
  onDeleteTheme?: () => void;
  isSelected: boolean;
  category: "featured" | "rayso" | "community" | "local";
}

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

export const ThemeCard: React.FC<ThemeCardProps> = ({
  showcaseColors,
  featuredTheme,
  nextTheme,
  displayName,
  onUseTheme,
  onDeleteTheme,
  isSelected,
  category,
}) => {
  const router = useRouter();
  const currentTheme = nextTheme === "light" ? "light" : "dark";
  const user = useUser();

  const handleEditTheme = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user.isSignedIn) router.push(`/generator?theme=${displayName}`);
    else router.push("/sign-in");
  };

  // <SignInButton mode="modal">
  //   <Button variant="ghost">Log in</Button>
  // </SignInButton>

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <MotionCard
        className={cn(
          "overflow-hidden cursor-pointer transition-all duration-300",
          isSelected
            ? "border-primary shadow-lg"
            : "border-transparent hover:border-accent"
        )}
        onClick={onUseTheme}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div className="flex h-10 relative" variants={itemVariants}>
          {showcaseColors.map((colorKey, index) => (
            <motion.div
              key={colorKey}
              className="flex-1 h-full"
              style={{
                backgroundColor: featuredTheme[currentTheme][colorKey],
                zIndex: showcaseColors.length - index,
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
          <motion.h2
            className="text-lg font-semibold text-foreground"
            variants={itemVariants}
          >
            {displayName}
          </motion.h2>
          <motion.div className="flex space-x-2 mt-2" variants={itemVariants}>
            <Badge variant="secondary">
              {category === "rayso"
                ? "Ray.so"
                : category === "featured"
                  ? "Featured"
                  : category === "community"
                    ? "Community"
                    : "Local"}
            </Badge>
            <Badge variant="outline">
              {Object.keys(featuredTheme[currentTheme]).length} Colors
            </Badge>
          </motion.div>
          {isSelected && (
            <motion.div
              variants={itemVariants}
              className="absolute top-4 right-4 text-xs ext-primary font-medium flex items-center"
            >
              <IconCheck className="mr-1 w-4 h-4" />
              Selected
            </motion.div>
          )}
          <motion.div variants={itemVariants} className="mt-4 space-x-2 flex">
            {user.isSignedIn ? (
              <MotionButton
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleEditTheme}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconEdit className="mr-2 w-4 h-4" />
                Edit
              </MotionButton>
            ) : (
              <SignInDialog label="Edit" />
            )}
            {category === "local" && (
              <MotionButton
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTheme?.();
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconTrash className="mr-2 w-4 h-4" />
                Delete
              </MotionButton>
            )}
          </motion.div>
        </div>
      </MotionCard>
    </motion.div>
  );
};
