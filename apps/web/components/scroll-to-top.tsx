import { ArrowUpIcon } from "@radix-ui/react-icons";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Adjust this value based on when you want the button to appear
      setIsVisible(window.scrollY > 640);
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      onClick={scrollToTop}
      className="fixed top-4 flex gap-2 rounded-full z-[50] md:hidden"
      aria-label="Scroll to top"
    >
      <ArrowUpIcon />
      <span className="text-xs">Show Preview</span>
    </Button>
  );
}
