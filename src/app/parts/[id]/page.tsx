import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import PartCard from "@/components/PartCard";
import AmazonSearchLink from "@/components/AmazonSearchLink";
import JsonLd from "@/components/JsonLd";
import PartsDetailFaq from "@/components/PartsDetailFaq";
import { siteConfig } from "@/data/site-config";
import partsData from "@/data/parts.json";
import { CATEGORY_COLORS } from "@/types/parts";
import type { Part } from "@/types/parts";

const parts = partsData as Part[];

export async function generateStaticParams() {
  return parts.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const part = parts.find((p) => p.id === id);
  if (!part) return {};
  const title = `${part.name}とは？特徴・使い方・選び方｜DIYパーツ辞典`;
  const description = part.description;
  const url = `${siteConfig.url}/parts/${id}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      locale: "ja_JP",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PartDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const part = parts.find((p) => p.id === id);
  if (!part) notFound();

  const relatedParts = part.relatedParts
    .map((rid) => parts.find((p) => p.id === rid))
    .filter((p): p is Part => p !== undefined);

  const colors = CATEGORY_COLORS[part.category] ?? {
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border-gray-200",
  };

  const faqSchemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: part.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  // Detail paragraphs split by newlines
  const detailParagraphs = part.details
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { name: "パーツ辞典", href: "/parts" },
          { name: part.name, href: `/parts/${part.id}` },
        ]}
      />
      <JsonLd data={faqSchemaData} />

      {/* Header */}
      <div className="mt-4 mb-6">
        <span
          className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border} mb-2`}
        >
          {part.category}
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{part.name}</h1>
      </div>

      {/* Overview */}
      <section className="bg-[var(--color-bg)] rounded-xl p-5 mb-8">
        <h2 className="text-lg font-bold mb-2">概要</h2>
        <p className="text-gray-700 leading-relaxed">{part.description}</p>
      </section>

      {/* Detailed description */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">詳細説明</h2>
        <div className="space-y-3 text-gray-700 leading-relaxed">
          {detailParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* Specs table */}
      {part.specs.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">スペック・仕様</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <tbody>
                {part.specs.map((spec, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <th className="text-left px-4 py-3 font-medium text-gray-600 w-1/3 border-b border-gray-100">
                      {spec.label}
                    </th>
                    <td className="px-4 py-3 text-gray-800 border-b border-gray-100">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Use cases */}
      {part.useCases.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">主な用途</h2>
          <ul className="space-y-2">
            {part.useCases.map((useCase, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="text-[var(--color-primary)] font-bold mt-0.5">✓</span>
                <span>{useCase}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Tips */}
      {part.tips.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">使い方のコツ</h2>
          <div className="space-y-3">
            {part.tips.map((tip, i) => (
              <div
                key={i}
                className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-gray-700 text-sm leading-relaxed"
              >
                <span className="font-bold text-amber-700 mr-2">💡</span>
                {tip}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related parts */}
      {relatedParts.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">関連パーツ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedParts.map((rp) => (
              <PartCard key={rp.id} part={rp} />
            ))}
          </div>
        </section>
      )}

      {/* Amazon */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Amazon関連商品</h2>
        <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4 gap-4">
          <span className="font-medium text-gray-700 text-sm">{part.name}をAmazonで探す</span>
          <AmazonSearchLink keyword={part.amazonKeyword} title={part.name} />
        </div>
      </section>

      {/* FAQ accordion — client component */}
      {part.faq.length > 0 && <PartsDetailFaq faqs={part.faq} />}

      {/* Back link */}
      <div className="mt-10 pt-6 border-t border-gray-200">
        <Link
          href="/parts"
          className="text-[var(--color-primary)] hover:underline text-sm"
        >
          ← パーツ辞典一覧に戻る
        </Link>
      </div>
    </div>
  );
}
