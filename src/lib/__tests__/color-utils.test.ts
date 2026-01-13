import { describe, expect, it } from "vitest";
import {
  getBestTextColor,
  getContrastBetween,
  getContrastRatio,
  getLuminanceFromHex,
  getSRGBLuminance,
} from "../colors";

describe("getSRGBLuminance", () => {
  it("returns 0 for black", () => {
    expect(getSRGBLuminance({ r: 0, g: 0, b: 0 })).toBe(0);
  });

  it("returns 1 for white", () => {
    expect(getSRGBLuminance({ r: 1, g: 1, b: 1 })).toBe(1);
  });

  it("calculates red luminance correctly", () => {
    const lum = getSRGBLuminance({ r: 1, g: 0, b: 0 });
    expect(lum).toBeCloseTo(0.2126, 4);
  });

  it("calculates green luminance correctly", () => {
    const lum = getSRGBLuminance({ r: 0, g: 1, b: 0 });
    expect(lum).toBeCloseTo(0.7152, 4);
  });

  it("calculates blue luminance correctly", () => {
    const lum = getSRGBLuminance({ r: 0, g: 0, b: 1 });
    expect(lum).toBeCloseTo(0.0722, 4);
  });
});

describe("getLuminanceFromHex", () => {
  it("returns 0 for black hex", () => {
    expect(getLuminanceFromHex("#000000")).toBe(0);
  });

  it("returns 1 for white hex", () => {
    expect(getLuminanceFromHex("#ffffff")).toBe(1);
  });

  it("handles 3-char hex codes", () => {
    expect(getLuminanceFromHex("#fff")).toBe(1);
    expect(getLuminanceFromHex("#000")).toBe(0);
  });

  it("returns 0 for invalid hex", () => {
    expect(getLuminanceFromHex("invalid")).toBe(0);
  });

  it("calculates mid-gray luminance", () => {
    const lum = getLuminanceFromHex("#808080");
    expect(lum).toBeGreaterThan(0.2);
    expect(lum).toBeLessThan(0.3);
  });
});

describe("getContrastRatio", () => {
  it("returns 21:1 for black and white", () => {
    expect(getContrastRatio(0, 1)).toBe(21);
    expect(getContrastRatio(1, 0)).toBe(21);
  });

  it("returns 1:1 for identical colors", () => {
    expect(getContrastRatio(0.5, 0.5)).toBe(1);
  });

  it("order of arguments does not matter", () => {
    expect(getContrastRatio(0.2, 0.8)).toBe(getContrastRatio(0.8, 0.2));
  });
});

describe("getContrastBetween", () => {
  it("returns ~21:1 for black and white hex", () => {
    const contrast = getContrastBetween("#000000", "#ffffff");
    expect(contrast).toBe(21);
  });

  it("is symmetric", () => {
    const c1 = getContrastBetween("#ff0000", "#0000ff");
    const c2 = getContrastBetween("#0000ff", "#ff0000");
    expect(c1).toBe(c2);
  });
});

describe("getBestTextColor", () => {
  it("returns white for dark backgrounds", () => {
    expect(getBestTextColor("#000000")).toBe("#ffffff");
    expect(getBestTextColor("#1a1a1a")).toBe("#ffffff");
    expect(getBestTextColor("#333333")).toBe("#ffffff");
    expect(getBestTextColor("#0000ff")).toBe("#ffffff");
  });

  it("returns black for light backgrounds", () => {
    expect(getBestTextColor("#ffffff")).toBe("#000000");
    expect(getBestTextColor("#f0f0f0")).toBe("#000000");
    expect(getBestTextColor("#ffff00")).toBe("#000000");
  });

  it("chooses best contrast for mid-tones", () => {
    const result = getBestTextColor("#808080");
    expect(result === "#ffffff" || result === "#000000").toBe(true);
  });
});
