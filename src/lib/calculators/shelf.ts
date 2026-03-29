export interface ShelfInput {
  widthCm: number;
  heightCm: number;
  depthCm: number;
  segments: number;
  material: string;
}

export interface BoardItem {
  name: string;
  qty: number;
  widthCm: number;
  heightCm: number;
  thicknessMm: number;
  note: string;
}

export interface HardwareItem {
  name: string;
  qty: string;
  totalPrice: number;
  note: string;
  amazonKeyword: string;
}

export interface ToolItem {
  name: string;
  level: "必須" | "あると便利";
  estimatedPrice: string;
  amazonKeyword: string;
}

export interface ShelfResult {
  boards: BoardItem[];
  hardware: HardwareItem[];
  tools: ToolItem[];
  woodCost: number;
  hardwareCost: number;
  totalCost: number;
}

const MATERIALS: Record<string, { thicknessMm: number; pricePerCm2: number; screwMm: number }> = {
  "合板(12mm)":  { thicknessMm: 12, pricePerCm2: 0.109, screwMm: 35 },
  "集成材(18mm)": { thicknessMm: 18, pricePerCm2: 0.519, screwMm: 50 },
  "MDF(15mm)":  { thicknessMm: 15, pricePerCm2: 0.132, screwMm: 40 },
  "SPF 1×6材":  { thicknessMm: 19, pricePerCm2: 0.196, screwMm: 50 },
};

export const MATERIAL_OPTIONS = Object.keys(MATERIALS);

export function calculateShelf(input: ShelfInput): ShelfResult {
  const mat = MATERIALS[input.material] ?? MATERIALS["合板(12mm)"];
  const thickCm = mat.thicknessMm / 10;
  const { widthCm, heightCm, depthCm, segments } = input;
  const numShelves = Math.max(0, segments - 1);

  const boards: BoardItem[] = [
    { name: "側板", qty: 2, widthCm: depthCm, heightCm: heightCm, thicknessMm: mat.thicknessMm, note: "左右の縦板" },
    { name: "天板", qty: 1, widthCm: widthCm, heightCm: depthCm, thicknessMm: mat.thicknessMm, note: "上面" },
    { name: "底板", qty: 1, widthCm: widthCm, heightCm: depthCm, thicknessMm: mat.thicknessMm, note: "下面" },
  ];
  if (numShelves > 0) {
    boards.push({
      name: "棚板",
      qty: numShelves,
      widthCm: Math.round((widthCm - 2 * thickCm) * 10) / 10,
      heightCm: depthCm,
      thicknessMm: mat.thicknessMm,
      note: "内側の棚板（側板の内寸）",
    });
  }

  const totalAreaCm2 = boards.reduce((sum, b) => sum + b.qty * b.widthCm * b.heightCm, 0);
  const woodCost = Math.round(totalAreaCm2 * mat.pricePerCm2 / 100) * 100;

  const screwBags = Math.max(1, Math.ceil((segments + 2) * 8 / 100));
  const bracketQty = (numShelves + 2) * 2;

  const hardware: HardwareItem[] = [
    {
      name: `コーススレッド ${mat.screwMm}mm`,
      qty: `${screwBags}袋（約100本入り）`,
      totalPrice: screwBags * 400,
      note: "板の厚さの2.5倍程度が目安",
      amazonKeyword: `コーススレッド ${mat.screwMm}mm 100本`,
    },
    {
      name: "L字棚受け金具",
      qty: `${bracketQty}個`,
      totalPrice: bracketQty * 150,
      note: "各棚板を左右2箇所で補強",
      amazonKeyword: "L字金具 棚受け DIY",
    },
    {
      name: "木工用ボンド",
      qty: "1本",
      totalPrice: 400,
      note: "接合部の強度を上げる",
      amazonKeyword: "木工用ボンド 速乾",
    },
  ];
  if (segments >= 3) {
    hardware.push({
      name: "転倒防止金具",
      qty: "1セット",
      totalPrice: 600,
      note: "3段以上は壁への固定を推奨",
      amazonKeyword: "家具転倒防止金具 突っ張り",
    });
  }

  const hardwareCost = hardware.reduce((sum, h) => sum + h.totalPrice, 0);

  const tools: ToolItem[] = [
    { name: "電動インパクトドライバー", level: "必須", estimatedPrice: "¥5,000〜¥25,000", amazonKeyword: "電動インパクトドライバー DIY 初心者" },
    { name: "メジャー（コンベックス）", level: "必須", estimatedPrice: "¥300〜¥800", amazonKeyword: "コンベックス メジャー 5m" },
    { name: "さしがね（スコヤ）", level: "必須", estimatedPrice: "¥400〜¥1,200", amazonKeyword: "さしがね スコヤ 直角" },
    { name: "木工クランプ", level: "あると便利", estimatedPrice: "¥600〜¥1,500", amazonKeyword: "木工クランプ F型" },
    { name: "サンドペーパー（#120・#240）", level: "あると便利", estimatedPrice: "¥200〜¥500", amazonKeyword: "サンドペーパー 木材 セット" },
  ];

  return { boards, hardware, tools, woodCost, hardwareCost, totalCost: woodCost + hardwareCost };
}
