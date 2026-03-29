import Link from "next/link";
import JsonLd from "./JsonLd";
import { breadcrumbSchema } from "@/lib/jsonld";
import { siteConfig } from "@/data/site-config";

interface BreadcrumbItem {
  name: string;
  href: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const allItems = [{ name: "ホーム", href: "/" }, ...items];
  const schemaItems = allItems.map((item) => ({
    name: item.name,
    url: `${siteConfig.url}${item.href}`,
  }));

  return (
    <>
      <JsonLd data={breadcrumbSchema(schemaItems)} />
      <nav aria-label="パンくず" className="text-sm text-gray-500">
        <ol className="flex flex-wrap items-center gap-1">
          {allItems.map((item, i) => (
            <li key={item.href} className="flex items-center gap-1">
              {i < allItems.length - 1 ? (
                <>
                  <Link href={item.href} className="hover:text-[var(--color-primary)] transition-colors">
                    {item.name}
                  </Link>
                  <span>/</span>
                </>
              ) : (
                <span className="text-gray-700 font-medium">{item.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
