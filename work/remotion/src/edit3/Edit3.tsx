// Распаковка Kaspi: субтитры только на важных деталях, стили №2 и №3, только казахский.
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useFontsReady } from "../edit/Captions";
import "../style2/fonts";
import "../style3/fonts";
import { P } from "../style2/fonts";
import { BlurType, Numeral, ScriptWrite } from "../style2/anim";
import { Karaoke, Phrase, PhoneFlip, PhotoCard, TitleCard } from "../style3/anim";

export const FPS = 25;
export const DURATION = 294.16;

const k = (...ws: [string, number][]): Phrase["words"] => ws.map(([w, at]) => ({ w, at }));

// №3 — караоке на ключевых фразах (исправленный казахский)
const PHRASES: Phrase[] = [
  { words: k(["бірге", 3.68], ["распаковка", 4.18], ["жасайық", 4.56]), to: 5.6 },
  { words: k(["бір", 12.68], ["күннің", 12.92], ["ішінде", 13.18]), to: 13.7 },
  { words: k(["ойланбай", 13.7], ["заказ", 15.0], ["бердім", 15.4]), to: 16.3 },
  { words: k(["өте", 20.2], ["көп", 20.6], ["көмегін", 20.82], ["тигізеді", 21.18]), to: 22.9 },
  { words: k(["ашып", 25.58], ["көрейік", 25.9]), to: 27.0 },
  { words: k(["көп", 55.53], ["блогерлерден", 55.77]), to: 56.45 },
  { words: k(["көп", 56.45], ["адамдардан", 56.67], ["көрдім", 57.17]), to: 58.0 },
  { words: k(["жобаларыма", 66.03]), to: 67.9 },
  { words: k(["жақсы", 68.49], ["көмектеседі", 68.87]), to: 70.0 },
  { words: k(["күйеуім", 141.47], ["де", 141.9]), to: 142.25 },
  { words: k(["маған", 142.25], ["да", 142.59], ["заказ", 142.65], ["берді", 143.3]), to: 144.3 },
  { words: k(["екеуін", 144.41], ["заказ", 144.67], ["бердім", 145.0]), to: 146.0 },
  { words: k(["кез", 161.21], ["келген", 161.37], ["жерге", 161.75]), to: 163.0 },
  { words: k(["шамамен", 258.97], ["30", 259.37], ["мың", 259.61], ["теңге", 259.85]), to: 261.6 },
  { words: k(["телефонның", 263.5], ["артына", 264.4]), to: 265.6 },
];

type Head = { text: string; at: number; to: number; size: number; y: number; x?: number; cream?: boolean };
// №2 — заголовки из размытия (скобки — главное слово)
const HEADS: Head[] = [
  { text: "[блогыма]", at: 17.74, to: 22.9, size: 92, y: 1120 },
  { text: "[жұмысыма]", at: 19.22, to: 22.9, size: 92, y: 1225, cream: true },
  { text: "LARK M2", at: 48.3, to: 53.4, size: 120, y: 1170 },
  { text: "микрофон", at: 48.6, to: 53.4, size: 64, y: 1300, cream: true },
  { text: "[терезеге]", at: 148.63, to: 153.2, size: 86, y: 1100 },
  { text: "[айнаға]", at: 149.21, to: 153.2, size: 86, y: 1200, cream: true },
  { text: "[машинаға]", at: 153.6, to: 156.4, size: 96, y: 1150 },
  { text: "[чехол]", at: 163.57, to: 166.0, size: 110, y: 1150 },
  { text: "[ұстағыш]", at: 190.79, to: 195.3, size: 104, y: 1290 },
  { text: "[жарық]", at: 195.43, to: 199.5, size: 110, y: 1290, cream: true },
  { text: "СОҢҒЫ САТЫП АЛУ", at: 245.67, to: 249.8, size: 74, y: 1150 },
  { text: "[ең қымбаты]", at: 256.07, to: 258.9, size: 96, y: 1150, cream: true },
];

type Script = { text: string; at: number; to: number; size: number; y: number; x?: number; dur?: number };
const SCRIPTS: Script[] = [
  { text: "қатты қалап жүрген", at: 8.68, to: 11.6, size: 78, y: 1260, x: 230, dur: 0.75 },
  { text: "ойланбай", at: 13.7, to: 15.0, size: 0, y: 0 }, // заглушка (не рисуется)
  { text: "көп адамнан көрдім", at: 0, to: 0, size: 0, y: 0 },
  { text: "өте ұнады", at: 54.11, to: 55.5, size: 80, y: 1250, x: 300, dur: 0.6 },
  { text: "керемет", at: 196.5, to: 199.5, size: 0, y: 0 },
  { text: "үйге барған соң ашамын", at: 276.2, to: 279.0, size: 66, y: 1250, x: 120, dur: 0.9 },
  { text: "рахмет!", at: 288.61, to: 293.0, size: 120, y: 1150, x: 300, dur: 0.6 },
  { text: "сау болыңыз", at: 293.03, to: 294.16, size: 84, y: 1280, x: 260, dur: 0.5 },
].filter((s) => s.size > 0);

type Num = { n: string; at: number; to: number; label: string };
const NUMS: Num[] = [
  { n: "1", at: 5.76, to: 8.6, label: "ең бірінші" },
  { n: "2", at: 133.99, to: 139.8, label: "екінші зат" },
  { n: "3", at: 187.89, to: 190.7, label: "үшінші зат" },
];

const CARDS = [
  { src: "src3/lark_c.jpg", at: 49.2, to: 53.4, from: "left" as const },
  { src: "src3/holder_c.jpg", at: 146.07, to: 152.8, from: "left" as const },
  { src: "src3/monitor_c.jpg", at: 256.6, to: 261.6, from: "left" as const },
];

const within = (t: number, a: number, b: number) => t >= a && t < b;

export const Edit3: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const ready = useFontsReady();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <OffthreadVideo src={staticFile("src3/main.mp4")} style={{ width: 1080, height: 1920 }} />
      {/* лёгкое затемнение сверху и в зоне текста */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,14,35,0.35) 0%, rgba(10,14,35,0) 22%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.28) 72%, rgba(0,0,0,0) 90%)" }} />
      {ready ? (
        <>
          <TitleCard title="РАСПАКОВКА" script="Kaspi-дан" at={0} to={3.6} shineAt={1.0} />
          <Karaoke phrases={PHRASES} top={1430} size={58} />
          {HEADS.filter((h) => within(t, h.at, h.to)).map((h, i) => (
            <div key={i} style={{ position: "absolute", left: h.x ?? 90, top: h.y }}>
              <BlurType text={h.text} at={h.at} size={h.size} color={h.cream ? P.cream : P.white} perChar={0.024} />
            </div>
          ))}
          {SCRIPTS.filter((s) => within(t, s.at, s.to)).map((s, i) => (
            <div key={i} style={{ position: "absolute", left: s.x ?? 120, top: s.y }}>
              <ScriptWrite text={s.text} at={s.at} size={s.size} dur={s.dur} />
            </div>
          ))}
          {NUMS.filter((n) => within(t, n.at, n.to)).map((n, i) => (
            <div key={i}>
              <Numeral n={n.n} at={n.at} size={460} style={{ position: "absolute", left: 60, top: 1020 }} />
              <div style={{ position: "absolute", left: 300, top: 1215 }}>
                <BlurType text={n.label} at={n.at + 0.1} size={76} weight={700} perChar={0.02} />
              </div>
            </div>
          ))}
          {CARDS.map((c, i) => (
            <PhotoCard key={i} at={c.at} to={c.to} x={40} y={170} w={290} h={290} from={c.from}>
              <Img src={staticFile(c.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </PhotoCard>
          ))}
          <PhoneFlip at={263.0} to={268.6} x={70} y={200} w={270}>
            <OffthreadVideo src={staticFile("src3/main.mp4")} startFrom={Math.round(20 * fps)} muted style={{ width: 540, height: 960, marginLeft: -120, marginTop: -60 }} />
          </PhoneFlip>
        </>
      ) : null}
      {/* звук */}
      <Sequence from={Math.round(1.0 * fps)} durationInFrames={Math.round(1.5 * fps)}><Audio src={staticFile("sfx/sparkle.wav")} volume={0.18} /></Sequence>
      <Sequence from={Math.round(288.61 * fps)} durationInFrames={Math.round(1.5 * fps)}><Audio src={staticFile("sfx/sparkle.wav")} volume={0.18} /></Sequence>
      {NUMS.map((n, i) => (
        <Sequence key={i} from={Math.round(n.at * fps)} durationInFrames={10}><Audio src={staticFile("sfx/tick.wav")} volume={0.35} /></Sequence>
      ))}
      {SCRIPTS.filter((s) => s.text !== "рахмет!").map((s, i) => (
        <Sequence key={i} from={Math.round(s.at * fps)} durationInFrames={Math.round(1.2 * fps)}><Audio src={staticFile("sfx/chime.wav")} volume={0.12} /></Sequence>
      ))}
      {CARDS.map((c, i) => (
        <Sequence key={i} from={Math.round(c.at * fps)} durationInFrames={12}><Audio src={staticFile("sfx/whoosh.wav")} volume={0.15} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
