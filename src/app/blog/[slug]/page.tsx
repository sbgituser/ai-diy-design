import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import ToolCard from "@/components/ToolCard";
import JsonLd from "@/components/JsonLd";
import { articleSchema, faqSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/data/site-config";
import articlesData from "@/data/articles.json";
import toolsData from "@/data/tools.json";
import type { Metadata } from "next";
export async function generateStaticParams() {
  return articlesData.map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articlesData.find((a) => a.slug === slug);
  if (!article) return {};
  return buildMetadata({ title: article.title, description: article.description, path: `/blog/${slug}` });
}
export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articlesData.find((a) => a.slug === slug);
  if (!article) notFound();
  const relatedTools = toolsData.filter((t) => article.relatedTools?.includes(t.slug));
  const schema = articleSchema({ title: article.title, description: article.description, publishedAt: article.publishedAt, updatedAt: article.updatedAt, url: `${siteConfig.url}/blog/${slug}` });
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ name: "ブログ", href: "/blog" }, { name: article.title, href: `/blog/${article.slug}` }]} />
      <JsonLd data={schema} />
      <span className="text-sm text-[var(--color-primary)] font-medium mt-4 block">{article.category}</span>
      <h1 className="text-2xl md:text-3xl font-bold mt-2 mb-2">{article.title}</h1>
      <time className="text-sm text-gray-400 block mb-8">更新日: {new Date(article.updatedAt).toLocaleDateString("ja-JP")}</time>
      <div className="space-y-1">
        {article.content.split("\n").map((line, i) => {
          if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-bold mt-8 mb-3 text-gray-800">{line.slice(3)}</h2>;
          if (line.startsWith("- ")) return <li key={i} className="ml-6 text-gray-700 list-disc">{line.slice(2)}</li>;
          if (line.trim() === "") return null;
          return <p key={i} className="text-gray-700 leading-relaxed">{line}</p>;
        })}
      </div>
      {relatedTools.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">関連ツール</h2>
          <div className="space-y-3">{relatedTools.map((tool) => (<ToolCard key={tool.slug} tool={tool} />))}</div>
        </section>
      )}
    </div>
  );
}
