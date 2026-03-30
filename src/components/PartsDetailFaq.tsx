"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

export default function PartsDetailFaq({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mt-2 mb-8">
      <h2 className="text-xl font-bold mb-4">よくある質問</h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              className="w-full text-left px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 flex justify-between items-center"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <span>Q. {faq.question}</span>
              <span className="text-[var(--color-primary)] flex-shrink-0 ml-2">
                {openIndex === i ? "▲" : "▼"}
              </span>
            </button>
            {openIndex === i && (
              <div className="px-4 py-3 bg-[var(--color-bg)] text-gray-600 text-sm">
                A. {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
