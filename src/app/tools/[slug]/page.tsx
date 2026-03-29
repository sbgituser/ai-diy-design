import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import FAQ from "@/components/FAQ";
import AmazonSearchLink from "@/components/AmazonSearchLink";
import JsonLd from "@/components/JsonLd";
import ToolRouter from "@/components/ToolRouter";
import { howToSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import toolsData from "@/data/tools.json";
import type { Metadata } from "next";
type Tool = (typeof toolsData)[number];
export async function generateStaticParams() {
  return toolsData.map((t) => ({ slug: t.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = toolsData.find((t) => t.slug === slug);
  if (!tool) return {};
  return buildMetadata({ title: tool.title, description: tool.description, path: `/tools/${slug}` });
}
export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = toolsData.find((t) => t.slug === slug) as Tool | undefined;
  if (!tool) notFound();
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ name: "ツール", href: "/tools" }, { name: tool.title, href: `/tools/${tool.slug}` }]} />
      <JsonLd data={howToSchema(tool)} />
      <div className="flex items-center gap-3 mt-4 mb-2">
        <span className="text-4xl">{tool.icon}</span>
        <div>
          <span className="text-xs text-[var(--color-primary)] font-medium">{tool.category}</span>
          <h1 className="text-2xl md:text-3xl font-bold">{tool.title}</h1>
        </div>
      </div>
      <p className="text-gray-500 mb-8">{tool.description}</p>
      <ToolRouter slug={tool.slug} />
      {tool.relatedProducts && tool.relatedProducts.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4">関連商品（Amazon）</h2>
          <div className="space-y-3">
            {tool.relatedProducts.map((product) => (
              <div key={product.keyword} className="flex items-center justify-between bg-white rounded-lg border border-gray-100 p-4 gap-4">
                <span className="font-medium text-gray-700 text-sm">{product.title}</span>
                <AmazonSearchLink keyword={product.keyword} title={product.title} />
              </div>
            ))}
          </div>
        </section>
      )}
      {tool.faq && tool.faq.length > 0 && <FAQ faqs={tool.faq} />}
    </div>
  );
}
