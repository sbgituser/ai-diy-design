import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import PartCard from "@/components/PartCard";
import JsonLd from "@/components/JsonLd";
import { siteConfig } from "@/data/site-config";
import partsData from "@/data/parts.json";
import categoriesData from "@/data/part-categories.json";
import { CATEGORY_ORDER, CATEGORY_COLORS } from "@/types/parts";
import type { Part } from "@/types/parts";

export const metadata: Metadata = {
  title: "DIYパーツ辞典｜材料・工具・金具を徹底解説",
  description:
    "DIYに使う木材・金具・塗料・工具・アジャスターなど30種類のパーツを徹底解説。特徴・使い方・選び方・FAQ付き。",
  alternates: { canonical: `${siteConfig.url}/parts` },
  openGraph: {
    title: "DIYパーツ辞典｜材料・工具・金具を徹底解説",
    description:
      "DIYに使う木材・金具・塗料・工具・アジャスターなど30種類のパーツを徹底解説。",
    url: `${siteConfig.url}/parts`,
    siteName: siteConfig.name,
    type: "website",
    locale: "ja_JP",
  },
};

const collectionPageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "DIYパーツ辞典",
  description:
    "DIYに使う木材・金具・塗料・工具・アジャスターなど30種類のパーツを徹底解説。",
  url: `${siteConfig.url}/parts`,
};

export default function PartsListPage() {
  const parts = partsData as Part[];

  // Group parts by category in CATEGORY_ORDER
  const grouped = CATEGORY_ORDER.map((catName) => {
    const category = categoriesData.find((c) => c.name === catName);
    const categoryParts = parts.filter((p) => p.category === catName);
    return { catName, category, parts: categoryParts };
  }).filter((g) => g.parts.length > 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ name: "パーツ辞典", href: "/parts" }]} />
      <JsonLd data={collectionPageSchema} />

      <h1 className="text-2xl md:text-3xl font-bold mt-4 mb-2">DIYパーツ辞典</h1>
      <p className="text-gray-500 mb-8">
        DIYに使う木材・金具・塗料・工具・アジャスターなど全{parts.length}種類を徹底解説。
        特徴・使い方・選び方・よくある質問まで網羅しています。
      </p>

      <div className="space-y-12">
        {grouped.map(({ catName, category, parts: catParts }) => {
          const colors = CATEGORY_COLORS[catName] ?? {
            bg: "bg-gray-100",
            text: "text-gray-800",
            border: "border-gray-200",
          };
          return (
            <section key={catName}>
              <div className="flex items-center gap-3 mb-4">
                {category && (
                  <span className="text-2xl" aria-hidden="true">
                    {category.icon}
                  </span>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-800">{catName}</h2>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}
                    >
                      {catParts.length}件
                    </span>
                  </div>
                  {category && (
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catParts.map((part) => (
                  <PartCard key={part.id} part={part} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-12 bg-[var(--color-bg)] rounded-xl p-6 text-center">
        <p className="text-gray-600 mb-4">DIY設計ツールも合わせてご利用ください</p>
        <Link
          href="/tools"
          className="inline-block bg-[var(--color-primary)] text-white font-bold py-2 px-6 rounded-full hover:opacity-90 transition-opacity"
        >
          ツール一覧を見る →
        </Link>
      </div>
    </div>
  );
}
