// Theme vendor types and utilities

export const VENDORS = {
  TWEAKCN: "tweakcn",
  RAYSO: "rayso",
  TINTE: "tinte", // Default for user-generated themes
} as const;

export type Vendor = typeof VENDORS[keyof typeof VENDORS];

export const VENDOR_LABELS: Record<Vendor, string> = {
  [VENDORS.TWEAKCN]: "TweakCN",
  [VENDORS.RAYSO]: "Ray.so",
  [VENDORS.TINTE]: "Tinte",
};

export const VENDOR_COLORS: Record<Vendor, string> = {
  [VENDORS.TWEAKCN]: "blue",
  [VENDORS.RAYSO]: "purple",
  [VENDORS.TINTE]: "green",
};

export function getVendorLabel(vendor: string): string {
  return VENDOR_LABELS[vendor as Vendor] || vendor;
}

export function getVendorColor(vendor: string): string {
  return VENDOR_COLORS[vendor as Vendor] || "gray";
}

export function isValidVendor(vendor: string): vendor is Vendor {
  return Object.values(VENDORS).includes(vendor as Vendor);
}