import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SCRIPT, SH, SUBF, TITLE, Y } from "./fonts";

const useT = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { t: f / fps, f, fps };
};

// Караоке-субтитры: фраза из 2–3 слов, текущее слово подсвечено жёлтым
export type Phrase = { words: { w: string; at: number }[]; to: number };
export const Karaoke: React.FC<{ phrases: Phrase[]; top: number; size?: number }> = ({ phrases, top, size = 44 }) => {
  const { t } = useT();
  const ph = phrases.find((p) => t >= p.words[0].at && t < p.to);
  if (!ph) return null;
  const cur = [...ph.words].reverse().find((x) => t >= x.at);
  return (
    <div style={{ position: "absolute", left: 120, right: 120, top, textAlign: "center", fontFamily: SUBF, fontWeight: 600, fontSize: size, lineHeight: 1.18, textShadow: SH }}>
      {ph.words.map((x, i) => (
        <span key={i} style={{ color: x === cur ? Y.yellow : Y.white }}>
          {x.w}
          {i < ph.words.length - 1 ? " " : ""}
        </span>
      ))}
    </div>
  );
};

// Четырёхлучевая звёздочка-блик
const Star: React.FC<{ x: number; y: number; s: number; o: number }> = ({ x, y, s, o }) => (
  <svg width={s} height={s} viewBox="-10 -10 20 20" style={{ position: "absolute", left: x - s / 2, top: y - s / 2, opacity: o, overflow: "visible" }}>
    <path d="M0,-10 C1,-2 2,-1 10,0 C2,1 1,2 0,10 C-1,2 -2,1 -10,0 C-2,-1 -1,-2 0,-10Z" fill="#FFF6D8" />
  </svg>
);

// Заголовок: жёлтые капсом + рукописная строка, по которой проходит блик, и мерцающие звёздочки
export const TitleCard: React.FC<{ title: string; script: string; at: number; to: number; shineAt: number }> = ({ title, script, at, to, shineAt }) => {
  const { t, fps } = useT();
  if (t < at || t >= to) return null;
  const pop = spring({ frame: Math.round((t - at) * fps), fps, config: { damping: 16, stiffness: 180 } });
  const sh = interpolate(t - shineAt, [0, 0.7], [-30, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const tw = (ph: number) => 0.35 + 0.65 * Math.abs(Math.sin((t - at) * 3.2 + ph));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", transform: `scale(${0.9 + 0.1 * pop})`, opacity: pop }}>
      <div style={{ fontFamily: TITLE, fontWeight: 800, fontSize: 96, color: Y.yellow, letterSpacing: "0.01em", textShadow: SH, lineHeight: 1 }}>{title}</div>
      <div style={{ position: "relative", display: "inline-block", marginTop: 4 }}>
        <div
          style={{
            fontFamily: SCRIPT, fontSize: 74, color: Y.white, transform: "scaleX(1.25) skewX(-10deg)", textShadow: SH, paddingRight: "0.3em",
            WebkitMaskImage: `linear-gradient(100deg, #fff 0%, #fff ${sh - 12}%, rgba(255,255,255,0.35) ${sh - 4}%, #fff ${sh}%, rgba(255,255,255,0.35) ${sh + 4}%, #fff ${sh + 12}%, #fff 100%)`,
          }}
        >
          {script}
        </div>
        <Star x={-28} y={40} s={34} o={tw(0)} />
        <Star x={430} y={8} s={40} o={tw(1.3)} />
        <Star x={470} y={52} s={22} o={tw(2.1)} />
      </div>
      {t >= shineAt && t < shineAt + 0.7 ? (
        <div style={{ position: "absolute", left: `${sh}%`, top: 98, width: 160, height: 4, marginLeft: -80, background: "linear-gradient(90deg, transparent, #FFF6D8, transparent)", filter: "blur(1px)" }} />
      ) : null}
    </div>
  );
};

// Карточка-фото (на белом фоне), выезжает сбоку и мягко «садится»
export const PhotoCard: React.FC<{ at: number; to: number; x: number; y: number; w: number; h: number; from?: "left" | "right"; children: React.ReactNode }> = ({ at, to, x, y, w, h, from = "left", children }) => {
  const { t } = useT();
  if (t < at || t >= to) return null;
  const k = interpolate(t - at, [0, 0.35], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.4)) });
  const out = interpolate(t, [to - 0.18, to], [1, 0], { extrapolateLeft: "clamp" });
  const dx = (from === "left" ? -1 : 1) * (1 - k) * 260;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: "#F3F3F3", overflow: "hidden", transform: `translateX(${dx}px) rotate(${(1 - k) * (from === "left" ? -6 : 6)}deg)`, opacity: Math.min(k * 1.5, 1) * out, boxShadow: "0 14px 36px rgba(0,0,0,0.35)" }}>
      {children}
    </div>
  );
};

// Телефон, который разворачивается к зрителю в 3D и чуть покачивается
export const PhoneFlip: React.FC<{ at: number; to: number; x: number; y: number; w: number; children: React.ReactNode }> = ({ at, to, x, y, w, children }) => {
  const { t } = useT();
  if (t < at || t >= to) return null;
  const k = interpolate(t - at, [0, 0.55], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const out = interpolate(t, [to - 0.25, to], [1, 0], { extrapolateLeft: "clamp" });
  const h = w * 2.05;
  const float = Math.sin((t - at) * 2.2) * 4;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, perspective: 1400 }}>
      <div
        style={{
          width: "100%", height: "100%", borderRadius: w * 0.14, background: "#0E0E10", padding: w * 0.035, boxSizing: "border-box",
          transform: `rotateY(${(1 - k) * 88 * out + (1 - out) * -60}deg) rotateZ(${float * 0.4}deg) translateY(${float}px)`,
          boxShadow: "0 24px 60px rgba(0,0,0,0.45), inset 0 0 0 2px #2A2A2E", opacity: out,
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: w * 0.11, overflow: "hidden", background: "#fff" }}>
          {children}
          <div style={{ position: "absolute", left: "50%", top: w * 0.03, width: w * 0.32, height: w * 0.085, marginLeft: -w * 0.16, borderRadius: 99, background: "#0E0E10" }} />
        </div>
      </div>
    </div>
  );
};
