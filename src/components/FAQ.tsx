"use client";

import { useState } from "react";
import JsonLd from "./JsonLd";
import { faqSchema } from "@/lib/jsonld";

interface FAQItem {
  q: string;
  a: string;
}

export default function FAQ({ faqs }: { faqs: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mt-10">
      <JsonLd data={faqSchema(faqs)} />
      <h2 className="text-xl font-bold mb-4">よくある質問</h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              className="w-full text-left px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 flex justify-between items-center"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <span>Q. {faq.q}</span>
              <span className="text-[var(--color-primary)]">{openIndex === i ? "▲" : "▼"}</span>
            </button>
            {openIndex === i && (
              <div className="px-4 py-3 bg-[var(--color-bg)] text-gray-600 text-sm">
                A. {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
