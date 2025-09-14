"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";
import type { SemanticToken } from "@/lib/providers/vscode";

interface VSCodeOverridesContextType {
  overrides: Partial<Record<SemanticToken, string>>;
  setOverride: (token: SemanticToken, value: string) => void;
  clearOverride: (token: SemanticToken) => void;
  clearAllOverrides: () => void;
}

const VSCodeOverridesContext = createContext<VSCodeOverridesContextType | null>(
  null,
);

export function VSCodeOverridesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [overrides, setOverrides] = useState<
    Partial<Record<SemanticToken, string>>
  >({});

  const setOverride = (token: SemanticToken, value: string) => {
    setOverrides((prev) => ({
      ...prev,
      [token]: value,
    }));
  };

  const clearOverride = (token: SemanticToken) => {
    setOverrides((prev) => {
      const { [token]: _, ...rest } = prev;
      return rest;
    });
  };

  const clearAllOverrides = () => {
    setOverrides({});
  };

  return (
    <VSCodeOverridesContext.Provider
      value={{ overrides, setOverride, clearOverride, clearAllOverrides }}
    >
      {children}
    </VSCodeOverridesContext.Provider>
  );
}

export function useVSCodeOverrides() {
  const context = useContext(VSCodeOverridesContext);
  if (!context) {
    throw new Error(
      "useVSCodeOverrides must be used within VSCodeOverridesProvider",
    );
  }
  return context;
}
