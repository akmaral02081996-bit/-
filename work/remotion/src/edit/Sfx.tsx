import { Audio, Sequence, staticFile } from "remotion";
import { CUES, FPS, SHOTS } from "./data";

type Hit = { at: number; src: string; vol: number };

// Звук привязан к тем же событиям, что и картинка: наезды, слова, наклейки, значки.
const hits: Hit[] = [
  ...SHOTS.slice(1).map((s) => ({ at: s.from - 0.08, src: "sfx/whoosh.wav", vol: 0.5 })),
  ...CUES.flatMap((c) => [
    ...c.lines.map((l) => ({ at: l.at, src: c.behindRidge ? "sfx/whoosh.wav" : "sfx/pop.wav", vol: c.behindRidge ? 0.6 : 0.25 })),
    ...(c.stickers ?? []).map((s) => ({ at: s.at, src: "sfx/thump.wav", vol: 0.6 })),
    ...(c.icon ? [{ at: c.icon.at, src: "sfx/pop.wav", vol: 0.2 }] : []),
  ]),
];

export const Sfx: React.FC = () => (
  <>
    {hits.map((h, i) => (
      <Sequence key={i} from={Math.max(0, Math.round(h.at * FPS))} durationInFrames={40}>
        <Audio src={staticFile(h.src)} volume={h.vol} />
      </Sequence>
    ))}
  </>
);
