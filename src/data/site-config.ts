export const siteConfig = {
  name: "AI DIY設計ツール",
  description: "DIY家具・棚の設計支援ツール。寸法入力で材料リスト・コスト・カット図面を自動計算。無料でプロ級のDIY設計ができます。",
  domain: "ai-diy-design.kuras-plus.com",
  url: "https://ai-diy-design.kuras-plus.com",
  theme: "orange" as const,
  amazonTag: "kurasplus-22",
  ga4Id: "G-XXXXXXXXXX",
  ogImage: "/images/og-default.png",
  twitterHandle: "",
  nav: [
    { label: "ツール", href: "/tools" },
    { label: "ブログ", href: "/blog" },
  ],
};

export const themeColors = {
  blue:   { primary: "#2563EB", accent: "#3B82F6", bg: "#EFF6FF" },
  green:  { primary: "#059669", accent: "#10B981", bg: "#ECFDF5" },
  purple: { primary: "#7C3AED", accent: "#8B5CF6", bg: "#F5F3FF" },
  orange: { primary: "#EA580C", accent: "#F97316", bg: "#FFF7ED" },
};
