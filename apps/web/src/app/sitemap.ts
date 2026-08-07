import type { MetadataRoute } from "next";
import { THEMES_PATH, WORKBENCH_PATH } from "@/config/legacy";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  return [
    {
      url: siteConfig.url,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/design.md`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}${THEMES_PATH}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}${WORKBENCH_PATH}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    // Theme categories
    {
      url: `${siteConfig.url}${THEMES_PATH}?category=community`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.url}${THEMES_PATH}?category=rayso`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.url}${THEMES_PATH}?category=tweakcn`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.url}${THEMES_PATH}?category=tinte`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];
}
