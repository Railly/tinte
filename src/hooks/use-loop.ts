import { useRef, useState, useEffect } from "react";
import { useInView } from "motion/react";
import { PROVIDERS, type Provider } from "@/config/providers";

export function useLoop(): [Provider, React.RefObject<HTMLDivElement | null>] {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PROVIDERS.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isInView]);

  return [PROVIDERS[currentIndex], ref];
}