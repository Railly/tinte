import { siteConfig } from "@/config/site";

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
