export interface PaintInput {
  method: "area" | "dimensions";
  areaSqm: number;
  widthCm: number;
  heightCm: number;
  depthCm: number;
  paintType: string;
  coats: number;
}

export interface PaintResult {
  areaSqm: number;
  volumeMl: number;
  containerSize: string;
  dryingHours: string;
  tips: string[];
}

const PAINT_TYPES: Record<string, { coverageSqmPerL: number; dryHrsPerCoat: number; tip: string }> = {
  "水性ペンキ": { coverageSqmPerL: 6.0, dryHrsPerCoat: 2, tip: "乾燥後に#240サンドペーパーで軽く研磨すると仕上がりが良くなります" },
  "油性ペンキ": { coverageSqmPerL: 5.0, dryHrsPerCoat: 6, tip: "換気を十分に行い、乾燥時間を守ってください" },
  "水性ニス": { coverageSqmPerL: 8.0, dryHrsPerCoat: 2, tip: "木目を活かしたい場合に最適。3回塗りで美しい仕上がりに" },
  "油性ニス": { coverageSqmPerL: 6.0, dryHrsPerCoat: 6, tip: "耐水性・耐久性に優れます。屋外用にも使えます" },
  "ワックス": { coverageSqmPerL: 10.0, dryHrsPerCoat: 1, tip: "自然な風合いを出したい場合に。定期的なメンテナンスが必要です" },
};

export const PAINT_TYPE_OPTIONS = Object.keys(PAINT_TYPES);

function selectContainer(ml: number): string {
  if (ml <= 150) return "100mlサイズでOK";
  if (ml <= 400) return "200〜300mlを購入";
  if (ml <= 900) return "500mlを推奨";
  if (ml <= 1800) return "1Lを推奨";
  return `2L以上が必要（約${Math.ceil(ml / 1000)}L）`;
}

export function calculatePaint(input: PaintInput): PaintResult {
  const pt = PAINT_TYPES[input.paintType] ?? PAINT_TYPES["水性ペンキ"];
  let areaSqm: number;
  if (input.method === "dimensions") {
    const w = input.widthCm / 100;
    const h = input.heightCm / 100;
    const d = input.depthCm / 100;
    areaSqm = 2 * (w * h + w * d + h * d);
  } else {
    areaSqm = input.areaSqm;
  }
  areaSqm = Math.round(areaSqm * 100) / 100;
  const volumeMl = Math.ceil((areaSqm / pt.coverageSqmPerL) * input.coats * 1000);
  return {
    areaSqm,
    volumeMl,
    containerSize: selectContainer(volumeMl),
    dryingHours: `${pt.dryHrsPerCoat}時間/回 × ${input.coats}回 = 合計${pt.dryHrsPerCoat * input.coats}時間以上`,
    tips: [
      pt.tip,
      "塗装前に木材表面をサンドペーパー（#120）で研磨してください",
      "マスキングテープで塗りたくない部分を保護しましょう",
    ],
  };
}
