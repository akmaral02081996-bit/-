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
