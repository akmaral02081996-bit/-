import { AbsoluteFill, Img, staticFile, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { C } from "./theme";
import { HEAD, SUB } from "./fonts";

const pop = (frame: number, fps: number, at: number) =>
  spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 260, mass: 0.6 } });

export const Head: React.FC<{ text: string; color: string; at: number; size?: number; indent?: number }> = ({ text, color, at, size = 150, indent = 0 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  if (f < at) return null;
  const p = pop(f, fps, at);
  return (
    <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: size, lineHeight: 0.86, color, letterSpacing: "-0.035em",
      textTransform: "uppercase", marginLeft: indent, transform: `scale(${0.86 + 0.14 * p}) translateY(${(1 - p) * 18}px)`,
      transformOrigin: "left bottom", textShadow: "0 6px 24px rgba(0,0,0,0.28)", whiteSpace: "nowrap" }}>{text}</div>
  );
};

export const Sub: React.FC<{ words: string[]; at: number; step?: number; color?: string }> = ({ words, at, step = 5, color = C.white }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ fontFamily: SUB, fontWeight: 800, fontSize: 36, color, lineHeight: 1.05, textShadow: "0 3px 12px rgba(0,0,0,0.45)" }}>
      {words.map((w, i) => (f >= at + i * step ? <span key={i}>{w} </span> : null))}
    </div>
  );
};

export const StyleTest: React.FC = () => (
  <AbsoluteFill>
    <Img src={staticFile("styletest-bg.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(6px) brightness(0.9)" }} />
    <AbsoluteFill style={{ padding: "300px 90px 0 90px" }}>
      <Head text="Как писать" color={C.red} at={0} />
      <Head text="сценарий" color={C.red} at={6} indent={60} />
      <div style={{ marginTop: 18, marginLeft: 64 }}><Sub words={["разберём", "на", "практике"]} at={10} /></div>
      <div style={{ marginTop: 640 }}>
        <Head text="Бесплатно" color={C.pink} at={20} size={130} />
        <Sub words={["напиши", "«РЕАЛИТИ»", "в", "комментариях"]} at={24} />
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
