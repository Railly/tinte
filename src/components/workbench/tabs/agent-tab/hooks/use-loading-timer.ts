"use client";

import { useEffect, useMemo, useState } from "react";
import { TOOL_MESSAGES } from "../constants";

interface UseLoadingTimerProps {
  isLoading: boolean;
  hasActiveTool: boolean;
}

export function useLoadingTimer({
  isLoading,
  hasActiveTool,
}: UseLoadingTimerProps) {
  const [loadingTimer, setLoadingTimer] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [completedTime, setCompletedTime] = useState<number | null>(null);

  // Get current tool message based on timer
  const currentToolMessage = useMemo(() => {
    const messageIndex = Math.floor(loadingTimer / 2) % TOOL_MESSAGES.length;
    return TOOL_MESSAGES[messageIndex];
  }, [loadingTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const isAnyLoading = isLoading || hasActiveTool;

    if (isAnyLoading && !startTime) {
      // Start timing only if we haven't started yet
      setStartTime(Date.now());
      setLoadingTimer(0);
      setCompletedTime(null); // Reset completed time when starting new generation
    }

    if (isAnyLoading) {
      interval = setInterval(() => {
        if (startTime) {
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          setLoadingTimer(elapsed);
        }
      }, 1000);
    } else if (startTime && !completedTime) {
      // Capture the final time when generation completes
      const finalTime = Math.floor((Date.now() - startTime) / 1000);
      setCompletedTime(finalTime);
      setLoadingTimer(finalTime);
      // Don't reset the timer, just clear the start time
      setStartTime(null);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading, hasActiveTool, startTime, completedTime]);

  return {
    loadingTimer,
    currentToolMessage,
  };
}
