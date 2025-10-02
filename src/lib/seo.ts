import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  noIndex?: boolean;
  canonical?: string;
}

export function generateSEO({
  title,
  description = siteConfig.description,
  url = siteConfig.url,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  tags,
  noIndex = false,
  canonical,
}: SEOProps = {}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const pageUrl = url.startsWith("http") ? url : `${siteConfig.url}${url}`;

  const metadata: Metadata = {
    title: pageTitle,
    description,
    keywords: siteConfig.keywords,
    authors: [
      {
        name: siteConfig.author.name,
        url: siteConfig.author.url,
      },
      ...(authors?.map((name) => ({ name })) || []),
    ],
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonical || pageUrl,
    },
    openGraph: {
      type,
      locale: "en_US",
      url: pageUrl,
      title: pageTitle,
      description,
      siteName: siteConfig.name,
      // Note: OG images are handled by opengraph-image.tsx files
      // Don't add images here to avoid conflicts with file-based metadata
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors: [siteConfig.author.name, ...(authors || [])],
        tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      creator: siteConfig.author.twitter,
      site: siteConfig.author.twitter,
      // Note: Twitter images are handled by twitter-image.tsx files
      // Don't add images here to avoid conflicts with file-based metadata
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      nocache: false,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    category: siteConfig.categories[0],
    classification: siteConfig.categories.join(", "),
    other: {
      "application-name": siteConfig.name,
      "apple-mobile-web-app-title": siteConfig.name,
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
      "format-detection": "telephone=no",
      "mobile-web-app-capable": "yes",
      "msapplication-TileColor": "#000000",
      "msapplication-tap-highlight": "no",
      "theme-color": "#000000",
    },
  };

  return metadata;
}

export function generatePageSchema({
  title,
  description = siteConfig.description,
  url = siteConfig.url,
  type = "WebApplication",
  datePublished,
  dateModified,
}: {
  title?: string;
  description?: string;
  url?: string;
  type?: "WebApplication" | "WebPage" | "Article" | "SoftwareApplication";
  datePublished?: string;
  dateModified?: string;
} = {}) {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const pageUrl = url.startsWith("http") ? url : `${siteConfig.url}${url}`;

  const baseSchema = {
    "@context": "https://schema.org",
    "@type": type,
    name: pageTitle,
    description,
    url: pageUrl,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/icon.png`,
      },
    },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/themes?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  if (type === "WebApplication" || type === "SoftwareApplication") {
    return {
      ...baseSchema,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: siteConfig.features,
    };
  }

  if (type === "Article") {
    return {
      ...baseSchema,
      "@type": "Article",
      headline: pageTitle,
      datePublished,
      dateModified,
      articleSection: "Technology",
      wordCount: description.split(" ").length,
    };
  }

  return baseSchema;
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `${siteConfig.url}${item.url}`,
    })),
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.png`,
    description: siteConfig.longDescription,
    founder: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
    sameAs: [
      siteConfig.links.github,
      siteConfig.links.twitter,
      siteConfig.links.discord,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: siteConfig.links.discord,
    },
  };
}
