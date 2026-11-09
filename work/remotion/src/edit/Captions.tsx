import { useEffect, useState } from "react";
import { continueRender, delayRender, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fitText } from "@remotion/layout-utils";
import { C } from "../style/theme";
import { HEAD, SUB } from "../style/fonts";
import { Cue, Line } from "./data";

const LEFT = 90;
const MAX_W = 1080 - LEFT - 150; // справа — кнопки Reels

// Ждём загрузки шрифтов, чтобы правильно мерить ширину текста
export const useFontsReady = () => {
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender("fonts"));
  useEffect(() => {
    document.fonts.ready.then(() => Promise.all([document.fonts.load(`700 100px ${HEAD}`), document.fonts.load(`800 40px ${SUB}`)])).then(() => {
      setReady(true);
      continueRender(handle);
    });
  }, [handle]);
  return ready;
};

const usePop = (at: number) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = f - Math.round(at * fps);
  return { visible: local >= 0, p: spring({ frame: local, fps, config: { damping: 13, stiffness: 300, mass: 0.55 } }) };
};

const colorOf = (c: Line["color"]) => (c === "red" ? C.red : C.white);

export const fitSize = (text: string, max: number, width = MAX_W) =>
  Math.min(max, fitText({ text: text.toUpperCase(), withinWidth: width, fontFamily: HEAD, fontWeight: 700, letterSpacing: "-0.035em" }).fontSize);

export const HeadLine: React.FC<{ line: Line }> = ({ line }) => {
  const { visible, p } = usePop(line.at);
  if (!visible) return null;
  const size = fitSize(line.text, line.size ?? 180, MAX_W - (line.indent ?? 0));
  return (
    <div
      style={{
        fontFamily: HEAD, fontWeight: 700, fontSize: size, lineHeight: 0.88, color: colorOf(line.color),
        letterSpacing: "-0.035em", textTransform: "uppercase", marginLeft: line.indent ?? 0, whiteSpace: "nowrap",
        transform: `translateY(${(1 - p) * 26}px) scale(${0.84 + 0.16 * p})`, transformOrigin: "left bottom",
        textShadow: "0 3px 0 rgba(0,0,0,0.35), 0 6px 22px rgba(0,0,0,0.5)",
      }}
    >
      {line.text}
    </div>
  );
};

// Подпись, которая дописывается по словам
export const Words: React.FC<{ words: string; at: number; step?: number; size?: number; weight?: number; color?: string }> = ({
  words, at, step = 0.2, size = 38, weight = 800, color = C.white,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const list = words.split(" ");
  return (
    <div style={{ fontFamily: SUB, fontWeight: weight, fontSize: size, color, lineHeight: 1.12, maxWidth: MAX_W, textShadow: "0 3px 14px rgba(0,0,0,0.55)" }}>
      {list.map((w, i) => {
        const k = t - (at + i * step);
        if (k < 0) return null;
        const p = Math.min(1, k / 0.1);
        return (
          <span key={i} style={{ display: "inline-block", marginRight: "0.28em", opacity: p, transform: `translateY(${(1 - p) * 8}px)` }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

const Sticker: React.FC<{ text: string; at: number; rot: number }> = ({ text, at, rot }) => {
  const { visible, p } = usePop(at);
  if (!visible) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 26, transform: `rotate(${rot * p}deg) scale(${0.7 + 0.3 * p})`, transformOrigin: "left center" }}>
      <div
        style={{
          background: C.red, padding: "6px 26px 10px", fontFamily: HEAD, fontWeight: 700, fontSize: 130, lineHeight: 1, whiteSpace: "nowrap",
          color: C.white, textTransform: "uppercase", letterSpacing: "-0.03em",
          boxShadow: "0 10px 26px rgba(0,0,0,0.45), inset 0 0 0 3px rgba(255,255,255,0.06)",
          clipPath: "polygon(0 3%, 99% 0, 100% 96%, 1% 100%)",
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const CueView: React.FC<{ cue: Cue }> = ({ cue }) => (
  <div style={{ position: "absolute", left: LEFT, top: cue.top, width: MAX_W }}>
    {cue.above ? (
      <div style={{ marginBottom: 14 }}>
        <Words words={cue.above.words} at={cue.above.at} step={cue.above.step} size={46} />
      </div>
    ) : null}
    {cue.lines.map((l, i) => (
      <HeadLine key={i} line={l} />
    ))}
    {cue.stickers?.map((s, i) => <Sticker key={i} {...s} />)}
    {cue.below ? (
      <div style={{ marginTop: 18 }}>
        <Words words={cue.below.words} at={cue.below.at} step={cue.below.step} size={46} />
      </div>
    ) : null}
  </div>
);
