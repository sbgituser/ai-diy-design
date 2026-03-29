"use client";
import { useState } from "react";
import { calculateShelf, MATERIAL_OPTIONS } from "@/lib/calculators/shelf";
import AmazonSearchLink from "./AmazonSearchLink";

export default function ShelfCalculator() {
  const [widthCm, setWidthCm] = useState(60);
  const [heightCm, setHeightCm] = useState(180);
  const [depthCm, setDepthCm] = useState(30);
  const [segments, setSegments] = useState(3);
  const [material, setMaterial] = useState("合板(12mm)");

  const result = calculateShelf({ widthCm, heightCm, depthCm, segments, material });

  return (
    <div className="space-y-6">
      {/* Input form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-lg mb-4 text-gray-800">寸法・仕様を入力</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">幅 <span className="text-gray-400">（cm）</span></label>
            <input type="number" value={widthCm} min={10} max={300} onChange={(e) => setWidthCm(Number(e.target.value))} className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">高さ <span className="text-gray-400">（cm）</span></label>
            <input type="number" value={heightCm} min={10} max={300} onChange={(e) => setHeightCm(Number(e.target.value))} className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">奥行き <span className="text-gray-400">（cm）</span></label>
            <input type="number" value={depthCm} min={5} max={100} onChange={(e) => setDepthCm(Number(e.target.value))} className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">段数（仕切り数）</label>
            <select value={segments} onChange={(e) => setSegments(Number(e.target.value))} className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
              {[2,3,4,5,6].map((n) => <option key={n} value={n}>{n}段</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">板の種類</label>
            <select value={material} onChange={(e) => setMaterial(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
              {MATERIAL_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Cost summary */}
      <div className="bg-[var(--color-bg)] border border-orange-200 rounded-xl p-5">
        <h2 className="font-bold text-lg mb-3 text-gray-800">費用概算</h2>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xs text-gray-500 mb-1">木材費</p>
            <p className="font-bold text-[var(--color-primary)] text-xl">¥{result.woodCost.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">金具・部材費</p>
            <p className="font-bold text-[var(--color-primary)] text-xl">¥{result.hardwareCost.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg p-2">
            <p className="text-xs text-gray-500 mb-1">合計</p>
            <p className="font-bold text-[var(--color-primary)] text-2xl">¥{result.totalCost.toLocaleString()}</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">※ 工具費は含みません。ホームセンター平均価格の目安です。</p>
      </div>

      {/* Boards list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-lg mb-4 text-gray-800">必要な板（パーツリスト）</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50"><th className="text-left p-2 font-medium text-gray-600">パーツ名</th><th className="text-center p-2 font-medium text-gray-600">幅×高さ（cm）</th><th className="text-center p-2 font-medium text-gray-600">厚さ</th><th className="text-center p-2 font-medium text-gray-600">枚数</th><th className="text-left p-2 font-medium text-gray-600">備考</th></tr></thead>
            <tbody>
              {result.boards.map((b, i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="p-2 font-medium">{b.name}</td>
                  <td className="p-2 text-center">{b.widthCm} × {b.heightCm}</td>
                  <td className="p-2 text-center">{b.thicknessMm}mm</td>
                  <td className="p-2 text-center font-bold text-[var(--color-primary)]">{b.qty}枚</td>
                  <td className="p-2 text-gray-500 text-xs">{b.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hardware list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-lg mb-4 text-gray-800">ネジ・金具リスト</h2>
        <div className="space-y-3">
          {result.hardware.map((h, i) => (
            <div key={i} className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-sm">{h.name}</p>
                <p className="text-xs text-gray-500">{h.qty} / ¥{h.totalPrice.toLocaleString()} / {h.note}</p>
              </div>
              <AmazonSearchLink keyword={h.amazonKeyword} title={h.name} />
            </div>
          ))}
        </div>
      </div>

      {/* Tools */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-lg mb-4 text-gray-800">必要な工具</h2>
        <div className="space-y-2">
          {result.tools.map((t, i) => (
            <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${t.level === "必須" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-700"}`}>{t.level}</span>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">目安: {t.estimatedPrice}</p>
                </div>
              </div>
              <AmazonSearchLink keyword={t.amazonKeyword} title={t.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
