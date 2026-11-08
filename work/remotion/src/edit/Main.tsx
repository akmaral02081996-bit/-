import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "../style/fonts";
import { HEAD } from "../style/fonts";
import { C } from "../style/theme";
import { CUES, Cue } from "./data";
import { cameraAt, ridgeAt } from "./camera";
import { CueView, fitSize, useFontsReady } from "./Captions";
import { Icon } from "./Icons";

// Текст «за горами»: живёт в координатах исходного кадра и обрезается линией хребта
const BehindRidge: React.FC<{ cue: Cue; t: number }> = ({ cue, t }) => {
  const line = cue.lines[0];
  if (t < line.at) return null;
  const r = ridgeAt(t);
  const n = r.length;
  const pts = r.map((y, c) => `${((c + 0.5) * 1080) / n}px ${y + 4}px`);
  const clip = `polygon(0px 0px, 1080px 0px, 1080px ${r[n - 1] + 4}px, ${pts.reverse().join(", ")}, 0px ${r[0] + 4}px)`;
  const k = Math.min(1, (t - line.at) / 0.55);
  const e = 1 - Math.pow(1 - k, 3);
  const size = fitSize(line.text, line.size ?? 300, 980);
  // слово выезжает из-за гор вверх; низ букв остаётся за хребтом
  const finalTop = 60;
  return (
    <div style={{ position: "absolute", inset: 0, clipPath: clip }}>
      <div
        style={{
          position: "absolute", left: 0, width: 1080, textAlign: "center", top: finalTop + (1 - e) * size * 1.1,
          fontFamily: HEAD, fontWeight: 700, fontSize: size, lineHeight: 1, letterSpacing: "-0.03em", color: C.red,
          textShadow: "0 8px 30px rgba(0,0,0,0.3)",
        }}
      >
        {line.text}
      </div>
    </div>
  );
};

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const ready = useFontsReady();
  const cam = cameraAt(t);
  const active = CUES.filter((c) => t >= c.from && t < c.to);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {/* Мир: исходный кадр в координатах 1080×1920 + то, что «приклеено» к нему */}
      <AbsoluteFill style={{ transform: cam.transform, transformOrigin: "0 0" }}>
        <OffthreadVideo src={staticFile("src/main4k.mp4")} muted style={{ width: 2160, height: 3840, transform: "scale(0.5)", transformOrigin: "0 0" }} />
        {ready ? active.filter((c) => c.behindRidge).map((c, i) => <BehindRidge key={i} cue={c} t={t} />) : null}
      </AbsoluteFill>
      {/* Лёгкое затемнение сверху — для читаемости титров */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.0) 38%)" }} />
      {ready
        ? active.filter((c) => !c.behindRidge).map((c, i) => (
            <AbsoluteFill key={i}>
              <CueView cue={c} />
              {c.icon ? <Icon {...c.icon} /> : null}
            </AbsoluteFill>
          ))
        : null}
      <Sequence>
        <Audio src={staticFile("src/main.mp4")} />
      </Sequence>
    </AbsoluteFill>
  );
};
