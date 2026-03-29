"use client";
import { useState, useCallback } from "react";
import { calculateCutLayout, type PieceInput } from "@/lib/calculators/cut-layout";

const BOARD_SIZE_OPTIONS = [
  { label: "1820×910mm（サブロク合板）", value: "1820x910", w: 1820, h: 910 },
  { label: "1820×606mm（合板1/3幅）", value: "1820x606", w: 1820, h: 606 },
  { label: "910×910mm（合板半分）", value: "910x910", w: 910, h: 910 },
  { label: "600×900mm（集成材パネル）", value: "600x900", w: 600, h: 900 },
  { label: "1820×140mm（SPF 1×6 1本）", value: "1820x140", w: 1820, h: 140 },
];

const INITIAL_PIECES: PieceInput[] = [
  { id: "1", label: "天板", widthMm: 580, heightMm: 300, qty: 1 },
  { id: "2", label: "底板", widthMm: 580, heightMm: 300, qty: 1 },
  { id: "3", label: "側板", widthMm: 300, heightMm: 880, qty: 2 },
  { id: "4", label: "棚板", widthMm: 544, heightMm: 300, qty: 2 },
];

export default function CutLayoutTool() {
  const [boardSizeKey, setBoardSizeKey] = useState("1820x910");
  const [kerfMm, setKerfMm] = useState(3);
  const [pieces, setPieces] = useState<PieceInput[]>(INITIAL_PIECES);
  const [viewBoard, setViewBoard] = useState(0);

  const selectedBoard = BOARD_SIZE_OPTIONS.find((b) => b.value === boardSizeKey) ?? BOARD_SIZE_OPTIONS[0];
  const result = calculateCutLayout(pieces.filter(p => p.widthMm > 0 && p.heightMm > 0 && p.qty > 0), selectedBoard.w, selectedBoard.h, kerfMm);

  const addPiece = useCallback(() => {
    const newId = String(Date.now());
    setPieces((prev) => [...prev, { id: newId, label: `パーツ${prev.length + 1}`, widthMm: 200, heightMm: 200, qty: 1 }]);
  }, []);

  const removePiece = useCallback((id: string) => {
    setPieces((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updatePiece = useCallback((id: string, field: keyof PieceInput, value: string | number) => {
    setPieces((prev) => prev.map((p) => p.id === id ? { ...p, [field]: value } : p));
  }, []);

  // SVG scale
  const svgW = 580;
  const svgH = Math.round(svgW * selectedBoard.h / selectedBoard.w);
  const scaleX = svgW / selectedBoard.w;
  const scaleY = svgH / selectedBoard.h;

  const boardPlacements = result.placements.filter((p) => p.boardIndex === viewBoard);

  return (
    <div className="space-y-6">
      {/* Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-lg mb-4 text-gray-800">板材の設定</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">素材板のサイズ</label>
            <select value={boardSizeKey} onChange={(e) => { setBoardSizeKey(e.target.value); setViewBoard(0); }} className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
              {BOARD_SIZE_OPTIONS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">のこしろ（刃の幅）<span className="text-gray-400 ml-1">（mm）</span></label>
            <input type="number" value={kerfMm} min={1} max={10} onChange={(e) => setKerfMm(Number(e.target.value))} className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>
        </div>
      </div>

      {/* Piece list editor */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-gray-800">必要なパーツ一覧</h2>
          <button onClick={addPiece} className="bg-[var(--color-primary)] text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">+ 追加</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50"><th className="text-left p-2 font-medium text-gray-600">パーツ名</th><th className="text-center p-2 font-medium text-gray-600">幅（mm）</th><th className="text-center p-2 font-medium text-gray-600">高さ（mm）</th><th className="text-center p-2 font-medium text-gray-600">枚数</th><th className="p-2"></th></tr></thead>
            <tbody>
              {pieces.map((p) => (
                <tr key={p.id} className="border-t border-gray-100">
                  <td className="p-1"><input value={p.label} onChange={(e) => updatePiece(p.id, "label", e.target.value)} className="border border-gray-200 rounded px-2 py-1 w-full text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" /></td>
                  <td className="p-1"><input type="number" value={p.widthMm} min={1} onChange={(e) => updatePiece(p.id, "widthMm", Number(e.target.value))} className="border border-gray-200 rounded px-2 py-1 w-20 text-center text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" /></td>
                  <td className="p-1"><input type="number" value={p.heightMm} min={1} onChange={(e) => updatePiece(p.id, "heightMm", Number(e.target.value))} className="border border-gray-200 rounded px-2 py-1 w-20 text-center text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" /></td>
                  <td className="p-1"><input type="number" value={p.qty} min={1} max={20} onChange={(e) => updatePiece(p.id, "qty", Number(e.target.value))} className="border border-gray-200 rounded px-2 py-1 w-16 text-center text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" /></td>
                  <td className="p-1 text-center"><button onClick={() => removePiece(p.id)} className="text-red-400 hover:text-red-600 transition-colors px-2">✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-[var(--color-bg)] border border-orange-200 rounded-xl p-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div><p className="text-xs text-gray-500 mb-1">必要な板の枚数</p><p className="text-2xl font-bold text-[var(--color-primary)]">{result.totalBoards}<span className="text-sm font-normal ml-1">枚</span></p></div>
          <div><p className="text-xs text-gray-500 mb-1">端材率</p><p className="text-2xl font-bold text-[var(--color-primary)]">{result.wastePercent}<span className="text-sm font-normal ml-1">%</span></p></div>
          <div><p className="text-xs text-gray-500 mb-1">配置済みパーツ</p><p className="text-2xl font-bold text-[var(--color-primary)]">{result.placements.length}<span className="text-sm font-normal ml-1">個</span></p></div>
        </div>
      </div>

      {/* SVG Layout */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-gray-800">カットレイアウト図</h2>
          {result.totalBoards > 1 && (
            <div className="flex gap-1">
              {Array.from({ length: result.totalBoards }, (_, i) => (
                <button key={i} onClick={() => setViewBoard(i)} className={`px-3 py-1 rounded text-sm font-medium transition-colors ${viewBoard === i ? "bg-[var(--color-primary)] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{i + 1}枚目</button>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 mb-3">板サイズ: {selectedBoard.w} × {selectedBoard.h} mm</p>
        <div className="overflow-x-auto">
          <svg width={svgW} height={svgH} className="border border-gray-300 rounded bg-gray-50">
            {/* Board outline */}
            <rect x={0} y={0} width={svgW} height={svgH} fill="#F3F4F6" stroke="#9CA3AF" strokeWidth={2} />
            {/* Pieces */}
            {boardPlacements.map((placement, i) => {
              const px = Math.round(placement.x * scaleX);
              const py = Math.round(placement.y * scaleY);
              const pw = Math.round(placement.width * scaleX);
              const ph = Math.round(placement.height * scaleY);
              return (
                <g key={i}>
                  <rect x={px} y={py} width={pw} height={ph} fill={placement.color} stroke="#6B7280" strokeWidth={1} />
                  <text x={px + pw / 2} y={py + ph / 2 - 6} textAnchor="middle" fontSize={Math.min(11, pw / 4)} fill="#374151" fontWeight="bold">{placement.label}</text>
                  <text x={px + pw / 2} y={py + ph / 2 + 8} textAnchor="middle" fontSize={Math.min(9, pw / 5)} fill="#6B7280">{placement.width}×{placement.height}</text>
                </g>
              );
            })}
          </svg>
        </div>
        <p className="text-xs text-gray-400 mt-2">※ カット図面はホームセンターのカットサービスに持参できます。スクリーンショットや印刷でご利用ください。</p>
      </div>
    </div>
  );
}
