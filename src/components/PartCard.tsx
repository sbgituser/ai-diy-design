import Link from "next/link";
import { CATEGORY_COLORS } from "@/types/parts";
import type { Part } from "@/types/parts";

export default function PartCard({ part }: { part: Part }) {
  const colors = CATEGORY_COLORS[part.category] ?? {
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border-gray-200",
  };

  return (
    <Link
      href={`/parts/${part.id}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-[var(--color-primary)] transition-all group"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <span
            className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border} mb-2`}
          >
            {part.category}
          </span>
          <h3 className="font-bold text-gray-800 group-hover:text-[var(--color-primary)] transition-colors">
            {part.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{part.description}</p>
        </div>
      </div>
    </Link>
  );
}
