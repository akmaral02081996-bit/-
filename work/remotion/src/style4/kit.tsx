import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export const SERIF = "PT Serif"; // жёлтые узкие заголовки (сжимаем по ширине)
export const BRUSH = "Lobster"; // жёлтое каллиграфическое слово
export const SANS = "Rubik"; // белые строки и слова на цветке
loadFont({ family: SERIF, url: staticFile("fonts/PTSerif-Bold.ttf"), weight: "700" });
loadFont({ family: BRUSH, url: staticFile("fonts/Lobster.ttf"), weight: "400" });
loadFont({ family: SANS, url: staticFile("fonts/Rubik.ttf"), weight: "300 900" });

export const K = { yellow: "#F7C21B", white: "#FFFFFF", pink: "#F4A6D0", pinkDeep: "#E77DB8", center: "#F6E27A" };
const SH = "0 2px 4px rgba(0,0,0,0.35), 0 4px 14px rgba(0,0,0,0.3)";

const useT = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return { t: f / fps, fps }; };

// Узкий жёлтый заголовок с засечками: появляется слева направо (маска)
export const SerifTitle: React.FC<{ text: string; at: number; to: number; size: number; style?: React.CSSProperties }> = ({ text, at, to, size, style }) => {
  const { t } = useT();
  if (t < at || t >= to) return null;
  const k = interpolate(t - at, [0, 0.35], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: size, color: K.yellow, transform: "scaleX(0.78)", transformOrigin: "left", whiteSpace: "nowrap", textShadow: SH, clipPath: `inset(-20% ${100 - k * 100}% -20% 0)`, ...style }}>
      {text}
    </div>
  );
};

// Каллиграфическое жёлтое слово с тёмной обводкой: «пишется» + лёгкий наклон
export const BrushWord: React.FC<{ text: string; at: number; to: number; size: number; style?: React.CSSProperties }> = ({ text, at, to, size, style }) => {
  const { t } = useT();
  if (t < at || t >= to) return null;
  const k = interpolate(t - at, [0, 0.45], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  return (
    <div style={{ fontFamily: BRUSH, fontSize: size, color: K.yellow, WebkitTextStroke: `${Math.max(1, size / 45)}px rgba(90,60,0,0.55)`, paintOrder: "stroke fill", transform: "rotate(-6deg)", whiteSpace: "nowrap", textShadow: SH, clipPath: `inset(-30% ${100 - k * 105}% -30% -5%)`, paddingRight: "0.2em", ...style }}>
      {text}
    </div>
  );
};

// Белая строка: слова появляются по одному под голос
export const WhiteLine: React.FC<{ words: [string, number][]; to: number; size: number; script?: boolean; style?: React.CSSProperties }> = ({ words, to, size, script, style }) => {
  const { t } = useT();
  if (t < words[0][1] || t >= to) return null;
  return (
    <div style={{ fontFamily: script ? BRUSH : SANS, fontWeight: script ? 400 : 600, fontSize: size, color: K.white, textShadow: SH, whiteSpace: "nowrap", transform: script ? "rotate(-4deg)" : undefined, ...style }}>
      {words.map(([w, at], i) => {
        const k = interpolate(t - at, [0, 0.12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <span key={i} style={{ opacity: k, display: "inline-block", transform: `translateY(${(1 - k) * 6}px)`, marginRight: "0.25em" }}>{w}</span>;
      })}
    </div>
  );
};

// Розовый «нарисованный» цветок со словом по центру: слово сменяется под голос
const petal = (a: number) => {
  const r = 78, cx = 100 + Math.cos(a) * 52, cy = 100 + Math.sin(a) * 52;
  return <ellipse cx={cx} cy={cy} rx={r * 0.62} ry={r * 0.5} transform={`rotate(${(a * 180) / Math.PI} ${cx} ${cy})`} />;
};
export const FlowerWord: React.FC<{ words: [string, number][]; from: number; to: number; x: number; y: number; size?: number }> = ({ words, from, to, x, y, size = 230 }) => {
  const { t, fps } = useT();
  if (t < from || t >= to) return null;
  const pop = spring({ frame: Math.round((t - from) * fps), fps, config: { damping: 11, stiffness: 220 } });
  const cur = [...words].reverse().find(([, at]) => t >= at);
  const wob = Math.sin((t - from) * 2.4) * 3;
  const angles = [0, 1, 2, 3, 4].map((i) => (i * 2 * Math.PI) / 5 - Math.PI / 2);
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, transform: `scale(${pop}) rotate(${wob}deg)` }}>
      <svg viewBox="0 0 200 200" width={size} height={size} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.18))" }}>
        <g fill={K.pink} stroke={K.pinkDeep} strokeWidth={3} strokeLinejoin="round">{angles.map((a, i) => <g key={i}>{petal(a)}</g>)}</g>
        <g stroke="#ffffff" strokeOpacity={0.45} strokeWidth={2.2} fill="none">
          {angles.map((a, i) => <path key={i} d={`M${100 + Math.cos(a) * 30} ${100 + Math.sin(a) * 30} Q ${100 + Math.cos(a + 0.25) * 60} ${100 + Math.sin(a + 0.25) * 60} ${100 + Math.cos(a) * 85} ${100 + Math.sin(a) * 85}`} />)}
        </g>
        <circle cx={100} cy={100} r={22} fill={K.center} stroke="#E2C451" strokeWidth={2} />
      </svg>
      {cur ? (
        <div style={{ position: "absolute", left: -40, right: -40, top: size / 2 - size * 0.08, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: size * 0.16, color: K.white, textShadow: "0 0 2px rgba(120,30,80,0.9), 0 1px 4px rgba(0,0,0,0.6)" }}>
          {cur[0]}
        </div>
      ) : null}
    </div>
  );
};

// Вставка-картинка с растушёванными краями
export const FeatherCard: React.FC<{ at: number; to: number; x: number; y: number; w: number; h: number; children: React.ReactNode }> = ({ at, to, x, y, w, h, children }) => {
  const { t } = useT();
  if (t < at || t >= to) return null;
  const k = Math.min(interpolate(t - at, [0, 0.25], [0, 1], { extrapolateRight: "clamp" }), interpolate(t, [to - 0.2, to], [1, 0], { extrapolateLeft: "clamp" }));
  const mask = "radial-gradient(ellipse 50% 50% at 50% 50%, #000 60%, transparent 100%)";
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: k, transform: `scale(${0.96 + 0.04 * k})`, WebkitMaskImage: mask, maskImage: mask }}>
      {children}
    </div>
  );
};

// Открытая пудреница с кисточкой: слово на зеркале, сменяется под голос
export const CompactWord: React.FC<{ words: { w: string; t: number }[]; x: number; y: number; size?: number; hideIn?: [number, number][] }> = ({ words, x, y, size = 250, hideIn = [] }) => {
  const { t, fps } = useT();
  const cur = [...words].reverse().find((o) => t >= o.t);
  if (!cur || hideIn.some(([a, b]) => t >= a && t < b)) return null;
  const idx = words.indexOf(cur);
  const local = t - cur.t;
  const bounce = spring({ frame: Math.round(local * fps), fps, config: { damping: 9, stiffness: 320, mass: 0.5 } });
  const wob = Math.sin(t * 2.2) * 2.5;
  const brushRot = -28 + Math.sin(t * 3.1) * 4;
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size * 1.05, transform: `rotate(${wob}deg) scale(${0.94 + 0.06 * bounce})` }}>
      <svg viewBox="0 0 200 210" width={size} height={size * 1.05} style={{ position: "absolute", inset: 0, overflow: "visible", filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.22))" }}>
        {/* крышка с зеркалом */}
        <ellipse cx={100} cy={62} rx={78} ry={52} fill="#F2B8CF" stroke="#D987AA" strokeWidth={3} />
        <ellipse cx={100} cy={62} rx={64} ry={41} fill="#FFF4F8" stroke="#E8A9C4" strokeWidth={2} />
        <path d="M60 46 Q 78 34 98 36" stroke="#ffffff" strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.9} />
        {/* петля */}
        <rect x={86} y={108} width={28} height={10} rx={4} fill="#D987AA" />
        {/* основание с пудрой */}
        <ellipse cx={100} cy={150} rx={80} ry={50} fill="#F2B8CF" stroke="#D987AA" strokeWidth={3} />
        <ellipse cx={100} cy={146} rx={64} ry={38} fill="#F5D3B7" stroke="#E6B894" strokeWidth={2} />
        <ellipse cx={92} cy={140} rx={30} ry={14} fill="#F9E2CF" opacity={0.8} />
        {[...Array(9)].map((_, i) => <circle key={i} cx={70 + ((i * 37) % 60)} cy={132 + ((i * 23) % 26)} r={1.6} fill="#fff" opacity={0.8} />)}
      </svg>
      {/* кисточка */}
      <svg viewBox="0 0 60 160" width={size * 0.26} height={size * 0.7} style={{ position: "absolute", left: size * 0.86, top: size * 0.32, transform: `rotate(${brushRot}deg)`, transformOrigin: "50% 90%", overflow: "visible" }}>
        <rect x={24} y={70} width={12} height={84} rx={6} fill="#C77D9C" />
        <rect x={20} y={60} width={20} height={16} rx={3} fill="#E9C46A" />
        <path d="M30 4 C 10 18 12 52 20 62 L40 62 C 48 52 50 18 30 4 Z" fill="#F7D9C4" stroke="#E5B896" strokeWidth={2} />
        <path d="M30 6 C 24 24 24 44 28 60" stroke="#fff" strokeWidth={2} opacity={0.7} fill="none" />
      </svg>
      {/* слово на зеркале */}
      <div
        key={idx}
        style={{
          position: "absolute", left: -30, right: -30, top: size * 0.2, textAlign: "center",
          fontFamily: SANS, fontWeight: 700, fontSize: size * Math.min(0.135, 1.05 / Math.max(1, cur.w.length)), color: "#B04E7E", letterSpacing: "0.01em",
          textShadow: "0 1px 0 #fff", transform: `scale(${0.85 + 0.15 * bounce})`, whiteSpace: "nowrap",
        }}
      >
        {cur.w.replace(/[.,!?;:«»"]+/g, "")}
      </div>
    </div>
  );
};

// Белая большая цифра с засечками
export const BigNum: React.FC<{ n: string; at: number; to: number; x: number; y: number; size: number }> = ({ n, at, to, x, y, size }) => {
  const { t, fps } = useT();
  if (t < at || t >= to) return null;
  const k = spring({ frame: Math.round((t - at) * fps), fps, config: { damping: 12, stiffness: 160 } });
  return <div style={{ position: "absolute", left: x, top: y, fontFamily: SERIF, fontWeight: 700, fontSize: size, color: K.white, lineHeight: 1, opacity: k, transform: `translateY(${(1 - k) * 40}px)`, textShadow: SH }}>{n}</div>;
};
