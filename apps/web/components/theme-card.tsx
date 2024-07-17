import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconSparkles, IconVercel } from "@/components/ui/icons";

interface ThemeCardProps {
  showcaseColors: string[];
  featuredTheme: any;
  nextTheme: string | undefined;
  displayName: string;
  onUseTheme: () => void;
  isSelected: boolean;
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

const MotionButton = motion(Button);

export const ThemeCard: React.FC<ThemeCardProps> = ({
  showcaseColors,
  featuredTheme,
  nextTheme,
  displayName,
  onUseTheme,
  isSelected,
}) => {
  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="overflow-hidden bg-accent/15">
        <motion.div className="flex h-8 relative" variants={itemVariants}>
          {showcaseColors.map((colorKey, index) => (
            <motion.div
              key={colorKey}
              className="flex-1 h-full"
              style={{
                backgroundColor: featuredTheme[nextTheme][colorKey],
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
        <div className="p-4">
          <motion.h2 className="text-lg font-semibold" variants={itemVariants}>
            {displayName}
          </motion.h2>
          <motion.div className="flex space-x-2 mt-2" variants={itemVariants}>
            <Badge variant="default">Featured</Badge>
            <Badge variant="default">
              {Object.keys(featuredTheme[nextTheme]).length} Colors
            </Badge>
          </motion.div>
          <motion.div variants={itemVariants}>
            <MotionButton
              variant={isSelected ? "default" : "outline"}
              className="mt-4 w-full"
              onClick={onUseTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSelected ? (
                <>
                  <IconVercel className="mr-2" />
                  Selected
                </>
              ) : (
                <>
                  <IconSparkles className="mr-2" />
                  Use this theme
                </>
              )}
            </MotionButton>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};
