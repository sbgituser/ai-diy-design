"use client";
import { useState } from "react";
import { calculatePaint, PAINT_TYPE_OPTIONS } from "@/lib/calculators/paint";
import AmazonSearchLink from "./AmazonSearchLink";

const PAINT_AMAZON_KEYWORDS: Record<string, string> = {
  "水性ペンキ": "水性ペンキ 木材用 DIY",
  "油性ペンキ": "油性ペンキ 木工用",
  "水性ニス": "水性ニス 木材 DIY",
  "油性ニス": "油性ニス 木工用 屋内",
  "ワックス": "木工用ワックス DIY",
};

export default function PaintCalculator() {
  const [method, setMethod] = useState<"area" | "dimensions">("area");
  const [areaSqm, setAreaSqm] = useState(2.0);
  const [widthCm, setWidthCm] = useState(60);
  const [heightCm, setHeightCm] = useState(80);
  const [depthCm, setDepthCm] = useState(30);
  const [paintType, setPaintType] = useState("水性ペンキ");
  const [coats, setCoats] = useState(2);

  const result = calculatePaint({ method, areaSqm, widthCm, heightCm, depthCm, paintType, coats });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-lg mb-4 text-gray-800">塗装情報を入力</h2>

        {/* Method toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-4 w-fit">
          <button onClick={() => setMethod("area")} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${method === "area" ? "bg-white text-[var(--color-primary)] shadow-sm" : "text-gray-600 hover:text-gray-800"}`}>面積で入力</button>
          <button onClick={() => setMethod("dimensions")} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${method === "dimensions" ? "bg-white text-[var(--color-primary)] shadow-sm" : "text-gray-600 hover:text-gray-800"}`}>寸法で入力</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {method === "area" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">塗装面積 <span className="text-gray-400">（㎡）</span></label>
              <input type="number" value={areaSqm} min={0.1} step={0.1} onChange={(e) => setAreaSqm(Number(e.target.value))} className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">幅 <span className="text-gray-400">（cm）</span></label>
                <input type="number" value={widthCm} min={1} onChange={(e) => setWidthCm(Number(e.target.value))} className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">高さ <span className="text-gray-400">（cm）</span></label>
                <input type="number" value={heightCm} min={1} onChange={(e) => setHeightCm(Number(e.target.value))} className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">奥行き <span className="text-gray-400">（cm）</span></label>
                <input type="number" value={depthCm} min={1} onChange={(e) => setDepthCm(Number(e.target.value))} className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">塗料の種類</label>
            <select value={paintType} onChange={(e) => setPaintType(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
              {PAINT_TYPE_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">塗り回数</label>
            <select value={coats} onChange={(e) => setCoats(Number(e.target.value))} className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
              {[1,2,3,4].map((n) => <option key={n} value={n}>{n}回塗り</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-[var(--color-bg)] border border-orange-200 rounded-xl p-5 space-y-4">
        <h2 className="font-bold text-lg text-gray-800">計算結果</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">塗装面積</p>
            <p className="text-2xl font-bold text-[var(--color-primary)]">{result.areaSqm} <span className="text-sm font-normal">㎡</span></p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">必要塗料量</p>
            <p className="text-2xl font-bold text-[var(--color-primary)]">{result.volumeMl} <span className="text-sm font-normal">ml</span></p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">購入目安</span>
            <span className="font-bold text-gray-800">{result.containerSize}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">乾燥スケジュール</span>
            <span className="font-bold text-gray-800 text-sm">{result.dryingHours}</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4">
          <p className="text-xs font-bold text-gray-600 mb-2">塗装のポイント</p>
          <ul className="space-y-1">
            {result.tips.map((tip, i) => <li key={i} className="text-sm text-gray-700 flex gap-2"><span className="text-[var(--color-primary)]">✓</span><span>{tip}</span></li>)}
          </ul>
        </div>
      </div>

      {/* Amazon links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-bold text-lg mb-3 text-gray-800">おすすめ商品（Amazon）</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg gap-4">
            <span className="text-sm font-medium text-gray-700">{paintType}（選択中の塗料）</span>
            <AmazonSearchLink keyword={PAINT_AMAZON_KEYWORDS[paintType] ?? paintType} title={paintType} />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg gap-4">
            <span className="text-sm font-medium text-gray-700">塗装用ハケ・ローラーセット</span>
            <AmazonSearchLink keyword="塗装用ハケ ローラー セット DIY" title="塗装用ハケ・ローラーセット" />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg gap-4">
            <span className="text-sm font-medium text-gray-700">マスキングテープ（塗装用）</span>
            <AmazonSearchLink keyword="マスキングテープ 塗装用 幅広" title="マスキングテープ（塗装用）" />
          </div>
        </div>
      </div>
    </div>
  );
}
