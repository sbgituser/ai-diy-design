import Breadcrumb from "@/components/Breadcrumb";
import BlogCard from "@/components/BlogCard";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/data/site-config";
import articlesData from "@/data/articles.json";
export const metadata = buildMetadata({ title: "ブログ", description: `${siteConfig.name}のDIY関連記事一覧。木材費用・作り方・塗装・カット方法を詳しく解説。`, path: "/blog" });
export default function BlogListPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ name: "ブログ", href: "/blog" }]} />
      <h1 className="text-2xl md:text-3xl font-bold mt-4 mb-8">DIYブログ記事一覧</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articlesData.map((article) => (<BlogCard key={article.slug} article={article} />))}
      </div>
    </div>
  );
}
