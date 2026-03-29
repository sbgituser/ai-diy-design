import { siteConfig } from "@/data/site-config";
export function websiteSchema() {
  return { "@context": "https://schema.org", "@type": "WebSite", name: siteConfig.name, url: siteConfig.url, description: siteConfig.description };
}
export function articleSchema(article: { title: string; description: string; publishedAt: string; updatedAt: string; url: string; image?: string; }) {
  return {
    "@context": "https://schema.org", "@type": "Article",
    headline: article.title, description: article.description,
    datePublished: article.publishedAt, dateModified: article.updatedAt,
    url: article.url, image: article.image ?? siteConfig.ogImage,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name, logo: { "@type": "ImageObject", url: `${siteConfig.url}/images/logo.png` } },
  };
}
export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })),
  };
}
export function howToSchema(tool: { title: string; description: string }) {
  return { "@context": "https://schema.org", "@type": "HowTo", name: tool.title, description: tool.description };
}
export function webApplicationSchema(tool: { slug: string; title: string; description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    description: tool.description,
    url: `${siteConfig.url}/tools/${tool.slug}`,
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JPY",
    },
  };
}
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: item.url })),
  };
}
