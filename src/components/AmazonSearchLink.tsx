"use client";
import { buildAmazonSearchUrl } from "@/lib/amazon";
import { trackAffiliateClick } from "@/lib/analytics";
interface Props { keyword: string; title: string; className?: string; }
export default function AmazonSearchLink({ keyword, title, className }: Props) {
  return (
    <a href={buildAmazonSearchUrl(keyword)} target="_blank" rel="nofollow sponsored noopener noreferrer"
      onClick={() => trackAffiliateClick(keyword, title)}
      className={`inline-flex items-center gap-2 bg-[#FF9900] hover:bg-[#e68900] text-white font-bold py-2 px-4 rounded transition-colors text-sm whitespace-nowrap ${className ?? ""}`}>
      <span>🛒</span><span>Amazonで見る</span>
    </a>
  );
}
