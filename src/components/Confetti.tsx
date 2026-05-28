import { useEffect, useState } from "react";

type Piece = { id: number; left: number; delay: number; color: string; rotate: number };

const COLORS = [
  "var(--primary)",    // 深藍
  "var(--success)",    // 鮮綠
  "oklch(0.91 0.04 160)",   // 薄荷綠
  "oklch(0.82 0.02 220)",   // 淺藍白
];

export function Confetti({ active, duration = 2200 }: { active: boolean; duration?: number }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!active) return;
    const next: Piece[] = Array.from({ length: 60 }, (_, i) => ({
      id: i + Math.random(),
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      color: COLORS[i % COLORS.length],
      rotate: Math.random() * 360,
    }));
    setPieces(next);
    const t = setTimeout(() => setPieces([]), duration);
    return () => clearTimeout(t);
  }, [active, duration]);

  if (pieces.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0.2; }
        }
      `}</style>
      <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
        {pieces.map((p) => (
          <span
            key={p.id}
            className="absolute top-0 block h-2.5 w-1.5 rounded-sm"
            style={{
              left: `${p.left}%`,
              background: p.color,
              transform: `rotate(${p.rotate}deg)`,
              animation: `confetti-fall ${1.6 + Math.random() * 0.8}s cubic-bezier(.2,.6,.4,1) ${p.delay}s forwards`,
            }}
          />
        ))}
      </div>
    </>
  );
}
