import { siteConfig } from "@/config/site";

export function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Allow all crawlers to access public pages
Allow: /themes
Allow: /workbench

# Disallow private/sensitive pages
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /static/

# Crawl delay for polite bots
Crawl-delay: 1

# Sitemap location
Sitemap: ${siteConfig.url}/sitemap.xml

# Additional directives for better SEO
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

# Block known bad bots
User-agent: SemrushBot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /
`;

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400", // Cache for 24 hours
    },
  });
}