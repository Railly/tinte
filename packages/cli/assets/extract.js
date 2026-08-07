// tinte from --emit-script
// Standalone browser-eval script for `agent-browser eval`. No imports, no
// external deps - runs in the page context. Walks every visible element,
// reads computed styles, and accumulates candidates weighted by painted
// area (rect.width * rect.height) and occurrence count. Also attempts to
// read document.styleSheets as a bonus signal (cross-origin sheets throw
// SecurityError and are recorded as blocked, never fatal).
//
// Output shape MUST match spike-data/vercel.json - that file is the
// contract other tooling (`tinte from --normalize`) is built against.
(function extract() {
  const bgColors = new Map(); // color -> { area, count }
  const textColors = new Map();
  const fontFamilies = new Set();
  const fontSizes = new Map(); // size -> count
  const fontWeights = new Set();
  const lineHeights = new Set();
  const radii = new Map(); // radius -> count
  const shadows = new Map(); // shadow -> count

  const allElements = document.querySelectorAll("*");
  let visibleCount = 0;

  function isVisible(el, style) {
    if (style.display === "none" || style.visibility === "hidden") return false;
    if (Number.parseFloat(style.opacity) === 0) return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function bump(map, key) {
    if (!key) return;
    const existing = map.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(key, { count: 1 });
    }
  }

  function bumpWithArea(map, key, area) {
    if (!key) return;
    const existing = map.get(key);
    if (existing) {
      existing.count += 1;
      existing.area = Math.max(existing.area, area);
    } else {
      map.set(key, { count: 1, area });
    }
  }

  function isTransparent(color) {
    if (!color) return true;
    if (color === "transparent") return true;
    const rgbaMatch = color.match(
      /rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*(?:,\s*([\d.]+)\s*)?\)/,
    );
    if (rgbaMatch && rgbaMatch[1] !== undefined) {
      return Number.parseFloat(rgbaMatch[1]) === 0;
    }
    return false;
  }

  for (const el of allElements) {
    const style = getComputedStyle(el);
    if (!isVisible(el, style)) continue;
    visibleCount += 1;

    const rect = el.getBoundingClientRect();
    const area = Math.round(rect.width * rect.height);

    const bg = style.backgroundColor;
    if (!isTransparent(bg)) {
      bumpWithArea(bgColors, bg, area);
    }

    const color = style.color;
    if (!isTransparent(color)) {
      bumpWithArea(textColors, color, area);
    }

    if (style.fontFamily) fontFamilies.add(style.fontFamily);
    if (style.fontSize) bump(fontSizes, style.fontSize);
    if (style.fontWeight) fontWeights.add(style.fontWeight);
    if (style.lineHeight) lineHeights.add(style.lineHeight);

    const borderRadius = style.borderRadius;
    if (borderRadius && borderRadius !== "0px") {
      radii.set(borderRadius, (radii.get(borderRadius) || 0) + 1);
    }

    const boxShadow = style.boxShadow;
    if (boxShadow && boxShadow !== "none") {
      shadows.set(boxShadow, (shadows.get(boxShadow) || 0) + 1);
    }
  }

  function toSortedByAreaArray(map) {
    return Array.from(map.entries())
      .map(([color, v]) => ({ color, area: v.area, count: v.count }))
      .sort((a, b) => b.area - a.area);
  }

  function toSortedEntryArray(map) {
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }

  const fontSizesSorted = Array.from(fontSizes.entries())
    .map(([size, count]) => ({ size, count }))
    .sort((a, b) => Number.parseFloat(a.size) - Number.parseFloat(b.size));

  const styleSheets = [];
  for (const sheet of Array.from(document.styleSheets)) {
    const href = sheet.href || "(inline)";
    try {
      const ruleCount = sheet.cssRules.length;
      styleSheets.push({ href, ok: true, ruleCount });
    } catch (error) {
      styleSheets.push({
        href,
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const result = {
    fontFamilies: Array.from(fontFamilies),
    fontSizesSorted,
    fontWeights: Array.from(fontWeights).sort(
      (a, b) => Number.parseFloat(a) - Number.parseFloat(b),
    ),
    lineHeights: Array.from(lineHeights),
    styleSheets,
    topBgColorsByArea: toSortedByAreaArray(bgColors).slice(0, 20),
    topTextColorsByArea: toSortedByAreaArray(textColors).slice(0, 20),
    totalElements: allElements.length,
    uniqueBgColors: bgColors.size,
    uniqueRadii: toSortedEntryArray(radii),
    uniqueShadows: toSortedEntryArray(shadows),
    uniqueTextColors: textColors.size,
    visibleElements: visibleCount,
  };

  console.log(JSON.stringify(result));
  return result;
})();
