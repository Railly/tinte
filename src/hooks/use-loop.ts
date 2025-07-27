import { useRef, useState, useEffect } from "react";
import { useInView } from "motion/react";

const providers = ["shadcn/ui", "VS Code"];

export function useLoop(): [string, React.RefObject<HTMLDivElement | null>] {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % providers.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isInView]);

  return [providers[currentIndex], ref];
}