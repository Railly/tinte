"use client";
import { motion } from "framer-motion";

const MidudevLogo = () => (
  <svg
    className="mr-1"
    version="1.2"
    preserveAspectRatio="xMidYMid"
    viewBox="0 0 228 198"
    xmlns="http://www.w3.org/2000/svg"
    height="16"
  >
    <g>
      <path
        fill="#199afc"
        d="M73.2 126.4c-15 15-15 39.3 0 54.3L19 126.4C4 111.5 4 87.2 19 72.2L73.2 18c15-15 39.2-15 54.2 0s15 39.2 0 54.2z"
      />
      <path
        fill="#1d5682"
        d="m73.2 126.4 27.1-27.1 27.1 27.1c15 15 15 39.3 0 54.3-15 14.9-39.2 14.9-54.2 0-15-15-15-39.3 0-54.3z"
      />
      <g>
        <path
          fill="#199afc"
          d="M185.5 84.3c8.3-8.2 8.3-21.7 0-29.9l30 29.9c8.2 8.3 8.2 21.7 0 30l-30 30c-8.3 8.3-21.7 8.3-30 0s-8.3-21.7 0-30z"
        />
        <path
          fill="#1d5682"
          d="m185.5 84.3-15 15-15-15c-8.3-8.2-8.3-21.7 0-29.9 8.3-8.3 21.7-8.3 30 0 8.3 8.2 8.3 21.7 0 29.9z"
        />
      </g>
    </g>
  </svg>
);

export const AchievementBanner: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-primary to-amber-900 dark:to-amber-100 text-primary-foreground py-2 px-4 text-center"
    >
      <p className="text-xs sm:text-sm font-medium flex flex-wrap justify-center items-center gap-1">
        <span>🏆 We won 3rd place at the</span>
        <span className="inline-flex items-center font-bold">▲ Vercel</span>
        <span>x</span>
        <span className="inline-flex items-center font-bold">
          <MidudevLogo />
          Midudev
        </span>
        <span>Hackathon!</span>
      </p>
    </motion.div>
  );
};
