import ShelfCalculator from "./ShelfCalculator";
import PaintCalculator from "./PaintCalculator";
import CutLayoutTool from "./CutLayoutTool";
export default function ToolRouter({ slug }: { slug: string }) {
  if (slug === "shelf-calculator") return <ShelfCalculator />;
  if (slug === "paint-calculator") return <PaintCalculator />;
  if (slug === "cut-layout") return <CutLayoutTool />;
  return <p className="text-gray-500">このツールは現在準備中です。</p>;
}
