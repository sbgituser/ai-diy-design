import Link from "next/link";
import ToolCard from "@/components/ToolCard";
import BlogCard from "@/components/BlogCard";
import { siteConfig } from "@/data/site-config";
import toolsData from "@/data/tools.json";
import articlesData from "@/data/articles.json";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({});

export default function HomePage() {
  return (
    <>
      <section className="bg-[var(--color-primary)] text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4">🪵</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{siteConfig.name}</h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">{siteConfig.description}</p>
          <Link href="/tools" className="inline-block bg-white text-[var(--color-primary)] font-bold py-3 px-8 rounded-full hover:bg-orange-50 transition-colors">
            ツールを使う →
          </Link>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl mb-3">📏</div>
            <h3 className="font-bold text-gray-800 mb-2">寸法を入力するだけ</h3>
            <p className="text-sm text-gray-500">幅・高さ・奥行きを入れると材料リストが自動計算されます</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="font-bold text-gray-800 mb-2">費用が事前にわかる</h3>
            <p className="text-sm text-gray-500">木材・金具・工具の費用をすべて合計して表示します</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl mb-3">📐</div>
            <h3 className="font-bold text-gray-800 mb-2">カット図面を自動生成</h3>
            <p className="text-sm text-gray-500">ホームセンターに持参できるSVG図面を自動作成します</p>
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold mb-6">DIY設計ツール一覧</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {toolsData.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">最新記事</h2>
          <Link href="/blog" className="text-[var(--color-primary)] hover:underline text-sm">すべて見る →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articlesData.slice(0, 3).map((article) => (
            <BlogCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
    </>
  );
}
