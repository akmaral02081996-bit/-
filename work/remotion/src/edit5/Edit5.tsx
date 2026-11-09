// Ролик про сухую кожу: стиль №4 (пудреница-стикер вместо цветка), казахский, вся речь в субтитрах.
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import analysis5 from "../data/analysis5.json";
import words from "../data/makeup_words.json";
import { makeCamera } from "../edit/camera";
import { Shot } from "../edit/data";
import { useFontsReady } from "../edit/Captions";
import { BigNum, BrushWord, CompactWord, FeatherCard, SerifTitle } from "../style4/kit";

export const FPS = 30;
export const DURATION = 165.7;
const W = words as { w: string; t: number; line: number }[];

// Смена крупности на каждой новой фразе (прячет склейки, держит динамику), наезд на щёку на «бетім құрғақ»
const lineStarts = [...new Set(W.map((x) => x.line))].map((l) => W.find((x) => x.line === l)!.t);
const SHOTS: Shot[] = lineStarts.map((s, i) => ({ from: i === 0 ? 0 : s - 0.05, to: i + 1 < lineStarts.length ? lineStarts[i + 1] - 0.05 : DURATION, z0: i % 2 ? 1.18 : 1.0, z1: i % 2 ? 1.22 : 1.04, faceY: 640 }));
const DRY: [number, number] = [16.3, 20.0];
const cam = makeCamera(analysis5 as never, SHOTS);

type Ev = { kind: "serif" | "brush"; text: string; at: number; to: number; size: number; x: number; y: number };
const EV: Ev[] = [
  { kind: "brush", text: "Қыздар!", at: 0.2, to: 2.9, size: 130, x: 110, y: 960 },
  { kind: "serif", text: "БЕТІҢІЗ ҚҰРҒАҚ ПА?", at: 3.0, to: 6.4, size: 104, x: 90, y: 980 },
  { kind: "serif", text: "МЕНІҢ КҮТІМІМ", at: 7.1, to: 11.4, size: 112, x: 90, y: 980 },
  { kind: "serif", text: "ҚҰРҒАҚ ТЕРІ", at: 16.45, to: 20.0, size: 104, x: 90, y: 1500 },
  { kind: "brush", text: "қабыршақтану", at: 17.62, to: 20.0, size: 96, x: 150, y: 1615 },
  { kind: "brush", text: "Қаскелең", at: 27.4, to: 31.3, size: 110, x: 110, y: 960 },
  { kind: "serif", text: "КҮШТІ САЛОН", at: 28.34, to: 31.3, size: 104, x: 90, y: 1090 },
  { kind: "serif", text: "РУФИЯ ХАНЫМ", at: 34.56, to: 40.0, size: 108, x: 90, y: 980 },
  { kind: "brush", text: "диагностика", at: 37.56, to: 40.0, size: 96, x: 150, y: 1100 },
  { kind: "serif", text: "ТОП-3 ӨНІМ", at: 48.06, to: 50.2, size: 130, x: 90, y: 980 },
  { kind: "brush", text: "Dr.Althea 345", at: 51.2, to: 56.0, size: 92, x: 90, y: 1500 },
  { kind: "serif", text: "ГЕЛЬ ТЕКСТУРА", at: 57.76, to: 61.0, size: 100, x: 90, y: 980 },
  { kind: "brush", text: "тартылмайды", at: 63.0, to: 66.0, size: 96, x: 120, y: 980 },
  { kind: "brush", text: "спрей", at: 71.42, to: 75.0, size: 110, x: 90, y: 1500 },
  { kind: "serif", text: "ҚАТЕЛЕСІППІН", at: 75.03, to: 77.6, size: 104, x: 90, y: 980 },
  { kind: "serif", text: "УВЛАЖНЯЕТ", at: 77.78, to: 81.0, size: 110, x: 90, y: 980 },
  { kind: "brush", text: "AQUA крем", at: 103.3, to: 108.0, size: 104, x: 90, y: 1500 },
  { kind: "serif", text: "СІҢІП КЕТЕДІ", at: 109.62, to: 113.5, size: 104, x: 90, y: 980 },
  { kind: "serif", text: "САҚТАП АЛЫҢЫЗ", at: 119.24, to: 123.0, size: 100, x: 90, y: 980 },
  { kind: "brush", text: "тіркеліңіз!", at: 129.48, to: 133.0, size: 110, x: 120, y: 980 },
  { kind: "serif", text: "ТРЕНД ЕМЕС", at: 141.7, to: 144.6, size: 112, x: 90, y: 980 },
  { kind: "serif", text: "ЛАЙК · КОММЕНТАРИЙ", at: 153.56, to: 157.5, size: 92, x: 90, y: 980 },
  { kind: "brush", text: "менімен бірге болыңыздар", at: 163.9, to: DURATION, size: 60, x: 50, y: 990 },
];

const NUMS = [
  { n: "1", at: 50.27, to: 56.0, img: "src5/p1_c.jpg" },
  { n: "2", at: 71.42, to: 75.0, img: "src5/p2_c.jpg" },
  { n: "3", at: 94.08, to: 104.5, img: "src5/p3_c.jpg" },
];

// «Лупа» на щеке: увеличенный участок кожи в круге
const Magnifier: React.FC<{ t: number }> = ({ t }) => {
  if (t < DRY[0] + 0.4 || t >= DRY[1]) return null;
  const k = Math.min(interpolate(t, [DRY[0] + 0.4, DRY[0] + 0.75], [0, 1], { extrapolateRight: "clamp" }), interpolate(t, [DRY[1] - 0.2, DRY[1]], [1, 0], { extrapolateLeft: "clamp" }));
  const f = cam.faceAt(t);
  const Z = 3.2, R = 190;
  const sx = f.x - 125, sy = f.y + 15; // точка на щеке в координатах кадра
  return (
    <div style={{ position: "absolute", left: 600, top: 1040, width: R * 2, height: R * 2, borderRadius: "50%", overflow: "hidden", opacity: k, transform: `scale(${0.7 + 0.3 * k})`, boxShadow: "0 0 0 8px #fff, 0 0 0 11px #F2B8CF, 0 18px 40px rgba(0,0,0,0.4)" }}>
      <div style={{ position: "absolute", left: R - sx * Z, top: R - sy * Z, width: 1080 * Z, height: 1920 * Z, transformOrigin: "0 0" }}>
        <Sequence from={Math.round(16.0 * FPS)} layout="none"><OffthreadVideo src={staticFile("src5/sharp.mp4")} muted style={{ width: 1080 * Z, height: 1920 * Z }} /></Sequence>
      </div>
    </div>
  );
};

// Вставки без звука поверх основного кадра (текст и стикер остаются сверху)
type Broll = { src: string; from: number; at: number; to: number; zoom?: [number, number] };
const BROLL: Broll[] = [
  { src: "broll5/routine.mp4", from: 25.0, at: 8.0, to: 10.8, zoom: [1.0, 1.06] },   // «күтіміме назар салыңыздар» — сыворотка
  { src: "broll5/flatlay.mp4", from: 0.0, at: 37.3, to: 40.6, zoom: [1.0, 1.08] },   // «диагностика жасап, күтім беретін» — лист ухода и средства
  { src: "broll5/routine.mp4", from: 162.0, at: 45.6, to: 48.0, zoom: [1.04, 1.0] }, // «таңдап берген … топ-3» — средства в руках
  { src: "broll5/routine.mp4", from: 2.0, at: 77.6, to: 81.8, zoom: [1.0, 1.05] },   // «увлажнять, әдемі етіп» — спрей
  { src: "broll5/routine.mp4", from: 92.0, at: 105.5, to: 109.5, zoom: [1.0, 1.05] }, // «текстурасы … қалмайды» — крем точками
  { src: "broll5/routine.mp4", from: 128.0, at: 109.6, to: 112.6, zoom: [1.05, 1.0] }, // «сіңіп кетеді, ақ дақ қалдырмайды» — втирает
  { src: "broll5/routine.mp4", from: 165.0, at: 119.2, to: 122.0, zoom: [1.0, 1.05] }, // «сақтап алыңыздар» — все средства
  { src: "broll5/routine.mp4", from: 140.0, at: 148.0, to: 151.0, zoom: [1.0, 1.05] }, // «әсер ететін өнімдер» — сияющая кожа
];
const BrollView: React.FC<{ b: Broll; t: number }> = ({ b, t }) => {
  const fade = Math.min(interpolate(t, [b.at, b.at + 0.12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), interpolate(t, [b.to - 0.12, b.to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const z = interpolate(t, [b.at, b.to], b.zoom ?? [1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <OffthreadVideo src={staticFile(b.src)} startFrom={Math.round(b.from * FPS)} muted style={{ width: 1080, height: 1920, transform: `scale(${z})` }} />
    </AbsoluteFill>
  );
};

export const Edit5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const ready = useFontsReady();
  let c = cam.cameraAt(t);
  if (t >= DRY[0] && t < DRY[1]) {
    // наезд на щёку
    const f = cam.faceAt(t);
    const z = interpolate(t, [DRY[0], DRY[0] + 0.6], [1.0, 1.9], { extrapolateRight: "clamp" });
    const cx = Math.min(1080 - 540 / z, Math.max(540 / z, f.x - 60));
    const cy = Math.min(1920 - 960 / z, Math.max(960 / z, f.y + 120));
    c = { ...c, transform: `translate(540px, 960px) scale(${z}) translate(${-cx}px, ${-cy}px)` };
  }
  const blocks: [number, number][] = [DRY, ...NUMS.map((n) => [n.at, n.at + 3.0] as [number, number])];
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: c.transform, transformOrigin: "0 0" }}>
        <OffthreadVideo src={staticFile("src5/main.mp4")} muted style={{ width: 1080, height: 1920 }} />
      </AbsoluteFill>
      {BROLL.map((b, i) => (
        <Sequence key={`b${i}`} from={Math.round(b.at * FPS)} durationInFrames={Math.round((b.to - b.at) * FPS)} layout="none">
          <BrollView b={b} t={t} />
        </Sequence>
      ))}
      {ready ? (
        <>
          <Magnifier t={t} />
          {NUMS.map((n, i) => (
            <div key={i}>
              <FeatherCard at={n.at + 0.1} to={n.to} x={560} y={880} w={460} h={600}>
                <Img src={staticFile(n.img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </FeatherCard>
              <BigNum n={n.n} at={n.at} to={n.to} x={90} y={1060} size={330} />
            </div>
          ))}
          {EV.map((e, i) =>
            e.kind === "serif" ? (
              <div key={i} style={{ position: "absolute", left: e.x, top: e.y }}><SerifTitle text={e.text} at={e.at} to={e.to} size={e.size} /></div>
            ) : (
              <div key={i} style={{ position: "absolute", left: e.x, top: e.y }}><BrushWord text={e.text} at={e.at} to={e.to} size={e.size} /></div>
            ),
          )}
          <CompactWord words={W} x={300} y={1400} size={250} hideIn={blocks} />
        </>
      ) : null}
      {/* звук: голос + фон + эффекты на каждой анимации */}
      <Audio src={staticFile("src5/voice.wav")} />
      <Audio src={staticFile("src5/music.wav")} volume={0.06} />
      {EV.map((e, i) => (
        <Sequence key={`e${i}`} from={Math.round(e.at * FPS)} durationInFrames={Math.round(1.2 * FPS)}>
          <Audio src={staticFile(e.kind === "brush" ? "sfx/swish_up.wav" : "sfx/whoosh.wav")} volume={e.kind === "brush" ? 0.16 : 0.12} />
        </Sequence>
      ))}
      {NUMS.map((n, i) => (
        <Sequence key={`n${i}`} from={Math.round(n.at * FPS)} durationInFrames={20}><Audio src={staticFile("sfx/tick.wav")} volume={0.4} /></Sequence>
      ))}
      <Sequence from={Math.round((DRY[0] + 0.4) * FPS)} durationInFrames={20}><Audio src={staticFile("sfx/puff.wav")} volume={0.35} /></Sequence>
      {/* «пуф» при каждом появлении стикера (после пауз/блоков) */}
      {[0.22, ...blocks.map((b) => b[1])].map((s, i) => (
        <Sequence key={`p${i}`} from={Math.round(s * FPS)} durationInFrames={15}><Audio src={staticFile("sfx/puff.wav")} volume={0.18} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
