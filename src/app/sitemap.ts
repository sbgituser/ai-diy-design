import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site-config";
import toolsData from "@/data/tools.json";
import articlesData from "@/data/articles.json";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date().toISOString();
  const tools = toolsData.map((t) => ({ url: `${base}/tools/${t.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 }));
  const articles = articlesData.map((a) => ({ url: `${base}/blog/${a.slug}`, lastModified: a.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 }));
  return [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/tools`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...tools, ...articles,
  ];
}
