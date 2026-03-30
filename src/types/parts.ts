export interface Part {
  id: string;
  name: string;
  category: string;
  description: string;
  details: string;
  specs: {
    label: string;
    value: string;
  }[];
  useCases: string[];
  tips: string[];
  relatedParts: string[];
  amazonKeyword: string;
  faq: {
    question: string;
    answer: string;
  }[];
  image?: string;
}

export interface PartCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
}

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "木材": { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-200" },
  "金具・接合": { bg: "bg-slate-100", text: "text-slate-800", border: "border-slate-200" },
  "塗装・仕上げ": { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" },
  "工具（手動）": { bg: "bg-green-100", text: "text-green-800", border: "border-green-200" },
  "工具（電動）": { bg: "bg-red-100", text: "text-red-800", border: "border-red-200" },
  "支柱・アジャスター": { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-200" },
};

export const CATEGORY_ORDER = [
  "木材",
  "金具・接合",
  "塗装・仕上げ",
  "工具（手動）",
  "工具（電動）",
  "支柱・アジャスター",
];
