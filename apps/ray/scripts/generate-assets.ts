import { writeFileSync } from "node:fs";
import { join } from "node:path";

const PUBLIC_DIR = join(import.meta.dir, "../public");

const faviconSvg = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="7" fill="#fafafa"/>
  <g transform="translate(4, 4)">
    <polyline points="15 19 21 13 15 7" fill="none" stroke="#09090b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <polyline points="9 7 3 13 9 19" fill="none" stroke="#09090b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`;

writeFileSync(join(PUBLIC_DIR, "favicon.svg"), faviconSvg);
console.log("Generated: public/favicon.svg");

const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://ray.tinte.dev/sitemap.xml
`;
writeFileSync(join(PUBLIC_DIR, "robots.txt"), robotsTxt);
console.log("Generated: public/robots.txt");

console.log("\nDone. OG images and favicon are generated at build time via Takumi:");
console.log("  - /opengraph-image (1200x630)");
console.log("  - /twitter-image (1200x600)");
console.log("  - /icon (32x32 PNG favicon)");
console.log("  - /apple-icon (180x180 PNG)");
