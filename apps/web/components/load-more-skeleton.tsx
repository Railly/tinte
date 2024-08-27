import { SHOWCASE_COLORS } from "@/lib/constants";
import { Card } from "./ui/card";
import { motion } from "framer-motion";

const SkeletonCard = () => (
  <Card className="overflow-hidden">
    <div className="flex h-10 relative">
      {SHOWCASE_COLORS.map((_, index) => (
        <motion.div
          key={index}
          className="flex-1 h-full bg-muted"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
    <div className="p-4 space-y-3">
      <motion.div
        className="h-6 w-3/4 bg-muted rounded"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
        }}
      />
      <div className="flex space-x-2">
        <motion.div
          className="h-5 w-16 bg-muted rounded"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="h-5 w-16 bg-muted rounded"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
        />
      </div>
      <div className="flex space-x-2">
        <motion.div
          className="h-8 flex-1 bg-muted rounded"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="h-8 flex-1 bg-muted rounded"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="h-8 w-8 bg-muted rounded"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  </Card>
);

export const LoadMoreSkeleton = ({ count = 12 }) => (
  <div className="w-full grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {Array.from({ length: count }).map((_, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: index * 0.1,
          ease: "easeOut",
        }}
      >
        <SkeletonCard />
      </motion.div>
    ))}
  </div>
);
