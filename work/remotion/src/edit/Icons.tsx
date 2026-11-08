import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../style/theme";

// Плоские значки в палитре ролика. x, y — в координатах экрана (от левого верхнего угла).
export const Icon: React.FC<{ kind: "bulb" | "sun"; at: number; x: number; y: number }> = ({ kind, at, x, y }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = f - Math.round(at * fps);
  if (local < 0) return null;
  const p = spring({ frame: local, fps, config: { damping: 10, stiffness: 220, mass: 0.6 } });
  const wobble = Math.sin(local / 9) * 4;
  const glow = 0.55 + 0.45 * Math.abs(Math.sin(local / 14));
  return (
    <svg
      width={200} height={200} viewBox="0 0 200 200"
      style={{ position: "absolute", left: x - 100, top: y - 100, transform: `scale(${p}) rotate(${wobble}deg)`, filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.35))", overflow: "visible" }}
    >
      {kind === "bulb" ? (
        <g>
          {[...Array(7)].map((_, i) => {
            const a = (-150 + i * 20) * (Math.PI / 180);
            return <line key={i} x1={100 + Math.cos(a) * 78} y1={88 + Math.sin(a) * 78} x2={100 + Math.cos(a) * 98} y2={88 + Math.sin(a) * 98} stroke={C.red} strokeWidth={9} strokeLinecap="round" opacity={glow} />;
          })}
          <circle cx={100} cy={88} r={54} fill={C.white} />
          <rect x={76} y={132} width={48} height={16} rx={4} fill={C.red} />
          <rect x={80} y={150} width={40} height={14} rx={4} fill={C.red} />
          <text x={100} y={112} textAnchor="middle" fontFamily="Oswald" fontWeight={700} fontSize={70} fill={C.red}>?</text>
        </g>
      ) : (
        <g>
          {[...Array(12)].map((_, i) => {
            const a = (i * 30 + local * 0.8) * (Math.PI / 180);
            return <line key={i} x1={100 + Math.cos(a) * 62} y1={100 + Math.sin(a) * 62} x2={100 + Math.cos(a) * 88} y2={100 + Math.sin(a) * 88} stroke={C.white} strokeWidth={9} strokeLinecap="round" />;
          })}
          <circle cx={100} cy={100} r={48} fill={C.red} />
        </g>
      )}
    </svg>
  );
};
