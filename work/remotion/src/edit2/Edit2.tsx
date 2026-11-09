import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import analysis2 from "../data/analysis2.json";
import { makeCamera } from "../edit/camera";
import { useFontsReady } from "../edit/Captions";
import "../style2/fonts";
import { P } from "../style2/fonts";
import { BlurType, Numeral, OneWord, ScriptWrite } from "../style2/anim";
import { BLOCKS, FPS, Item, SHOTS } from "./data";
import { interpolate } from "remotion";

// Вставки (без звука) поверх основного кадра; текст остаётся сверху
type Broll = { src: string; from: number; at: number; to: number; zoom?: [number, number] };
const BROLL: Broll[] = [
  { src: "broll/IMG_7183.mp4", from: 0.4, at: 6.0, to: 7.55, zoom: [1.0, 1.06] },   // «менің идея алатын жерім» — спуск по лестнице, селфи
  { src: "broll/IMG_7196.mp4", from: 0.0, at: 7.95, to: 8.9, zoom: [1.04, 1.0] },   // «тауларға келіп осылай» — у арки с видом на горы
  { src: "broll/IMG_7195.mp4", from: 1.0, at: 9.25, to: 10.45, zoom: [1.0, 1.05] }, // «серуендеп, демалып» — идёт по тропе
  { src: "broll/IMG_7186.mp4", from: 1.0, at: 18.0, to: 19.8, zoom: [1.06, 1.0] },  // «керемет, таза ауада демалу» — отдыхает на перилах
  { src: "broll/IMG_7183.mp4", from: 4.6, at: 23.0, to: 24.79, zoom: [1.0, 1.05] }, // «күнде таңертең» — солнце и горы
];

const BrollLayer: React.FC<{ t: number; fps: number }> = ({ t, fps }) => (
  <>
    {BROLL.filter((b) => t >= b.at - 0.01 && t < b.to).map((b, i) => {
      const fade = Math.min(interpolate(t, [b.at, b.at + 0.12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), interpolate(t, [b.to - 0.12, b.to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      const z = interpolate(t, [b.at, b.to], b.zoom ?? [1, 1]);
      return (
        <AbsoluteFill key={i} style={{ opacity: fade }}>
          <OffthreadVideo src={staticFile(b.src)} startFrom={Math.round(b.from * fps)} muted style={{ width: 1080, height: 1920, transform: `scale(${z})` }} />
        </AbsoluteFill>
      );
    })}
  </>
);

const cam = makeCamera(analysis2 as never, SHOTS);

const ItemView: React.FC<{ it: Item; to: number }> = ({ it, to }) => {
  switch (it.kind) {
    case "head":
      return (
        <div style={{ position: "absolute", left: it.x ?? 80, top: it.y }}>
          <BlurType text={it.text} at={it.at} size={it.size} color={it.cream ? P.cream : P.white} perChar={0.026} />
        </div>
      );
    case "script":
      return (
        <div style={{ position: "absolute", left: it.x ?? 80, top: it.y }}>
          <ScriptWrite text={it.text} at={it.at} size={it.size} dur={it.dur} />
        </div>
      );
    case "num":
      return (
        <>
          <Numeral n={it.n} at={it.at} size={430} style={{ position: "absolute", left: 60, top: 1040 }} />
          <div style={{ position: "absolute", left: 270, top: 1215 }}>
            {it.text.map((l, i) => (
              <BlurType key={i} text={l} at={it.at + 0.08 + i * 0.12} size={70} weight={700} perChar={0.018} style={{ marginTop: i ? 6 : 0 }} />
            ))}
          </div>
        </>
      );
    case "words":
      return (
        <div style={{ position: "absolute", left: 0, right: 0, top: it.y }}>
          <OneWord words={it.words.map(([w, at]) => ({ w, at }))} until={it.until ?? to} size={50} />
        </div>
      );
  }
};

export const Edit2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const ready = useFontsReady();
  const c = cam.cameraAt(t);
  const active = BLOCKS.filter((b) => t >= b.from && t < b.to);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: c.transform, transformOrigin: "0 0" }}>
        <OffthreadVideo src={staticFile("src2/main4k.mp4")} muted style={{ width: 2160, height: 3840, transform: "scale(0.5)", transformOrigin: "0 0" }} />
      </AbsoluteFill>
      {BROLL.map((b, i) => (
        <Sequence key={`b${i}`} from={Math.round(b.at * FPS)} durationInFrames={Math.round((b.to - b.at) * FPS) + 1} layout="none">
          <BrollLayer t={t} fps={fps} />
        </Sequence>
      ))}
      {/* мягкое затемнение под текстом (нижняя половина) и чуть сверху */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.38) 78%, rgba(0,0,0,0.2) 100%)" }} />
      {ready ? active.map((b, i) => <AbsoluteFill key={i}>{b.items.map((it, j) => <ItemView key={j} it={it} to={b.to} />)}</AbsoluteFill>) : null}
      <Audio src={staticFile("src2/main.mp4")} />
      <Audio src={staticFile("sfx/music2.wav")} volume={0.09} />
      {BLOCKS.flatMap((b) => b.items).map((it, i) =>
        it.kind === "script" ? (
          <Sequence key={i} from={Math.round(it.at * FPS)} durationInFrames={90}><Audio src={staticFile("sfx/chime.wav")} volume={0.22} /></Sequence>
        ) : it.kind === "num" ? (
          <Sequence key={i} from={Math.round(it.at * FPS)} durationInFrames={20}><Audio src={staticFile("sfx/tick.wav")} volume={0.45} /></Sequence>
        ) : null,
      )}
    </AbsoluteFill>
  );
};
