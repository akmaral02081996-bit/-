import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { P, SANS, SCRIPT, SERIF, SHADOW } from "./fonts";

const useT = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};
const ease = Easing.out(Easing.cubic);

// Буквы проявляются из размытия по одной (как «печатает»)
export const BlurType: React.FC<{
  text: string; at: number; size: number; color?: string; perChar?: number; weight?: number; style?: React.CSSProperties;
}> = ({ text, at, size, color = P.white, perChar = 0.028, weight = 800, style }) => {
  const t = useT();
  if (t < at) return null;
  return (
    <div style={{ fontFamily: SANS, fontWeight: weight, fontSize: size, color, lineHeight: 1, letterSpacing: "-0.01em", textShadow: SHADOW, whiteSpace: "nowrap", ...style }}>
      {[...text].map((ch, i) => {
        const k = interpolate(t - at - i * perChar, [0, 0.16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
        return (
          <span key={i} style={{ display: "inline-block", opacity: k, filter: `blur(${(1 - k) * 12}px)`, transform: `translateY(${(1 - k) * 6}px)`, whiteSpace: "pre" }}>
            {ch}
          </span>
        );
      })}
    </div>
  );
};

// Рукописная строка «пишется» слева направо
export const ScriptWrite: React.FC<{ text: string; at: number; dur?: number; size: number; style?: React.CSSProperties }> = ({ text, at, dur = 0.6, size, style }) => {
  const t = useT();
  if (t < at) return null;
  const k = interpolate(t - at, [0, dur], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  return (
    <div
      style={{
        fontFamily: SCRIPT, fontSize: size, color: P.white, lineHeight: 1, whiteSpace: "nowrap", textShadow: SHADOW,
        transform: "scaleX(1.35) skewX(-12deg)", transformOrigin: "left center",
        clipPath: `inset(-20% ${100 - k * 102}% -20% -2%)`, ...style,
      }}
    >
      {text}
    </div>
  );
};

// Большая бежевая цифра с засечками: проявляется из размытия
export const Numeral: React.FC<{ n: string; at: number; size: number; style?: React.CSSProperties }> = ({ n, at, size, style }) => {
  const t = useT();
  if (t < at) return null;
  const k = interpolate(t - at, [0, 0.45], [0, 1], { extrapolateRight: "clamp", easing: ease });
  return (
    <div
      style={{
        fontFamily: SERIF, fontWeight: 700, fontSize: size, lineHeight: 0.8, color: P.cream, opacity: 0.88 * k,
        filter: `blur(${(1 - k) * 22}px)`, transform: `scale(${1.12 - 0.12 * k})`, transformOrigin: "center", ...style,
      }}
    >
      {n}
    </div>
  );
};

// Субтитр по одному слову: каждое слово сменяет предыдущее
export const OneWord: React.FC<{ words: { w: string; at: number }[]; until: number; size?: number }> = ({ words, until, size = 46 }) => {
  const t = useT();
  if (t >= until) return null;
  const cur = [...words].reverse().find((x) => t >= x.at);
  if (!cur) return null;
  return <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: size, color: P.white, textShadow: SHADOW, textAlign: "center" }}>{cur.w}</div>;
};

// Карточка-вставка со скруглёнными углами
export const PipCard: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, children, style }) => {
  const t = useT();
  if (t < at) return null;
  const k = interpolate(t - at, [0, 0.35], [0, 1], { extrapolateRight: "clamp", easing: ease });
  return (
    <div style={{ position: "absolute", borderRadius: 28, overflow: "hidden", boxShadow: "0 18px 40px rgba(0,0,0,0.4)", opacity: k, transform: `translateY(${(1 - k) * 40}px) scale(${0.94 + 0.06 * k})`, ...style }}>
      {children}
    </div>
  );
};
