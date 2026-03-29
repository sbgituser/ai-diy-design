import ToolCard from "@/components/ToolCard";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/data/site-config";
import toolsData from "@/data/tools.json";
export const metadata = buildMetadata({ title: "ツール一覧", description: `${siteConfig.name}のDIY設計ツール一覧。棚の材料計算・塗装量計算・カット図面生成が無料でできます。`, path: "/tools" });
export default function ToolsListPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">DIY設計ツール一覧</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {toolsData.map((tool) => (<ToolCard key={tool.slug} tool={tool} />))}
      </div>
    </div>
  );
}
