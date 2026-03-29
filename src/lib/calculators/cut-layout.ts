export interface PieceInput {
  id: string;
  label: string;
  widthMm: number;
  heightMm: number;
  qty: number;
}

export interface PlacedPiece {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  pieceId: string;
  boardIndex: number;
  color: string;
}

export interface CutLayoutResult {
  placements: PlacedPiece[];
  totalBoards: number;
  boardWidthMm: number;
  boardHeightMm: number;
  usedAreaMm2: number;
  totalAreaMm2: number;
  wastePercent: number;
}

const COLORS = [
  "#FED7AA", "#FDBA74", "#FCA5A5", "#86EFAC",
  "#93C5FD", "#C4B5FD", "#FDE68A", "#A5F3FC",
  "#F9A8D4", "#BBF7D0",
];

export function calculateCutLayout(
  pieces: PieceInput[],
  boardWidthMm: number,
  boardHeightMm: number,
  kerfMm: number
): CutLayoutResult {
  // Expand by qty
  const expanded: { label: string; width: number; height: number; pieceId: string; colorIndex: number }[] = [];
  pieces.forEach((p, colorIdx) => {
    for (let q = 0; q < p.qty; q++) {
      expanded.push({ label: `${p.label}${p.qty > 1 ? ` (${q + 1}/${p.qty})` : ""}`, width: p.widthMm, height: p.heightMm, pieceId: p.id, colorIndex: colorIdx % COLORS.length });
    }
  });

  // Sort by height descending
  expanded.sort((a, b) => b.height - a.height);

  const placements: PlacedPiece[] = [];
  let currentBoard = 0;
  let currentX = 0;
  let currentY = 0;
  let currentRowHeight = 0;

  for (const piece of expanded) {
    if (piece.width > boardWidthMm || piece.height > boardHeightMm) continue; // skip pieces too large

    // Try to fit in current row
    if (currentX + piece.width <= boardWidthMm) {
      placements.push({ x: currentX, y: currentY, width: piece.width, height: piece.height, label: piece.label, pieceId: piece.pieceId, boardIndex: currentBoard, color: COLORS[piece.colorIndex] });
      currentX += piece.width + kerfMm;
      currentRowHeight = Math.max(currentRowHeight, piece.height);
    } else {
      // New row
      currentX = 0;
      currentY += currentRowHeight + kerfMm;
      currentRowHeight = 0;
      // New board if needed
      if (currentY + piece.height > boardHeightMm) {
        currentBoard++;
        currentX = 0;
        currentY = 0;
        currentRowHeight = 0;
      }
      placements.push({ x: currentX, y: currentY, width: piece.width, height: piece.height, label: piece.label, pieceId: piece.pieceId, boardIndex: currentBoard, color: COLORS[piece.colorIndex] });
      currentX += piece.width + kerfMm;
      currentRowHeight = piece.height;
    }
  }

  const totalBoards = currentBoard + 1;
  const usedAreaMm2 = expanded.reduce((sum, p) => sum + p.width * p.height, 0);
  const totalAreaMm2 = totalBoards * boardWidthMm * boardHeightMm;
  const wastePercent = Math.round((1 - usedAreaMm2 / totalAreaMm2) * 100);

  return { placements, totalBoards, boardWidthMm, boardHeightMm, usedAreaMm2, totalAreaMm2, wastePercent };
}
