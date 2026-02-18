"use client";

import { useMemo, useState } from "react";
import { generateRamp } from "@/lib/input-detection";

export function usePalette() {
  const [base, setBase] = useState("#657eab");
  const [shift, setShift] = useState(0.06);

  const ramp = useMemo(() => generateRamp(base), [base]);

  return {
    base,
    setBase,
    shift,
    setShift,
    ramp,
  };
}
