import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";
import { P } from "./fonts";
import { BlurType, Numeral, OneWord, PipCard, ScriptWrite } from "./anim";
import { useFontsReady } from "../edit/Captions";
import { faceAt } from "../edit/camera";

// Тест стиля №2 на кадрах прошлого ролика (временно, до нового исходника)
export const StyleTest2: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const ready = useFontsReady();
  const z = 1.55 + t * 0.03;
  const face = faceAt(13.6 + t);
  const cx = Math.min(1080 - 540 / z, Math.max(540 / z, face.x));
  const cy = Math.min(1920 - 960 / z, Math.max(960 / z, face.y - (780 - 960) / z));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(540px, 960px) scale(${z}) translate(${-cx}px, ${-cy}px)`, transformOrigin: "0 0" }}>
        <OffthreadVideo src={staticFile("src/main4k.mp4")} startFrom={60 * 13.6} muted style={{ width: 2160, height: 3840, transform: "scale(0.5)", transformOrigin: "0 0" }} />
      </AbsoluteFill>
      {ready && t < 2.25 ? (
        <AbsoluteFill style={{ padding: "1180px 80px 0" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
            <BlurType text="ИДЕЯНЫ" at={0.05} size={104} />
            <BlurType text="?" at={0.3} size={104} color={P.cream} />
          </div>
          <BlurType text="[қайдан аласыз]" at={0.45} size={78} style={{ marginTop: 6 }} />
          <ScriptWrite text="менің жерім" at={1.0} size={92} style={{ marginLeft: 300, marginTop: 2 }} />
        </AbsoluteFill>
      ) : null}
      {ready && t >= 2.3 ? (
        <AbsoluteFill>
          <Numeral n="2" at={2.3} size={420} style={{ position: "absolute", left: 70, top: 1050 }} />
          <div style={{ position: "absolute", left: 250, top: 1250 }}>
            <BlurType text="таза ауада" at={2.42} size={64} perChar={0.02} weight={700} />
            <BlurType text="серуендеймін" at={2.6} size={64} perChar={0.02} weight={700} style={{ marginTop: 4 }} />
          </div>
          <PipCard at={2.55} style={{ right: 60, top: 760, width: 300, height: 400 }}>
            <OffthreadVideo src={staticFile("src/main4k.mp4")} startFrom={60 * 9} muted style={{ width: 2160 * 0.42, height: 3840 * 0.42, marginLeft: -300, marginTop: -40 }} />
          </PipCard>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1560 }}>
            <OneWord words={[{ w: "серуендеп", at: 3.2 }, { w: "демалып", at: 3.75 }, { w: "тыныштық", at: 4.25 }]} until={4.8} />
          </div>
        </AbsoluteFill>
      ) : null}
      <Sequence from={Math.round(1.0 * fps)}><Audio src={staticFile("sfx/chime.wav")} volume={0.35} /></Sequence>
      <Sequence from={Math.round(2.3 * fps)}><Audio src={staticFile("sfx/tick.wav")} volume={0.5} /></Sequence>
    </AbsoluteFill>
  );
};
