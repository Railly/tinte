import { useEffect, useState } from "react";
import { type CommunityTheme, fetchCommunityThemes } from "@/lib/tinte-api";

type Vendor = "tinte" | "tweakcn" | "rayso";

export function useVendorThemes(vendor: Vendor) {
  const [themes, setThemes] = useState<CommunityTheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchCommunityThemes({ vendor, limit: 200 })
      .then((result) => {
        if (cancelled) return;
        if (result.total > 500) {
          setThemes([]);
        } else {
          setThemes(result.themes);
        }
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [vendor]);

  return { themes, loading };
}
