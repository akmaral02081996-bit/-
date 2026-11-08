import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import analysis2 from "../data/analysis2.json";
import { makeCamera } from "../edit/camera";
import { useFontsReady } from "../edit/Captions";
import "./fonts";
import { Karaoke, PhoneFlip, PhotoCard, TitleCard } from "./anim";

// Тест стиля №3 на начале второго исходника (временно, до нового видео)
const cam = makeCamera(analysis2 as never, [{ from: 0, to: 99, z0: 1.55, z1: 1.65, faceY: 900 }]);

export const StyleTest3: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const ready = useFontsReady();
  const c = cam.cameraAt(t);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: c.transform, transformOrigin: "0 0" }}>
        <OffthreadVideo src={staticFile("src2/main4k.mp4")} muted style={{ width: 2160, height: 3840, transform: "scale(0.5)", transformOrigin: "0 0" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,14,35,0.55) 0%, rgba(10,14,35,0) 30%)" }} />
      {ready ? (
        <>
          <TitleCard title="ИДЕЯ ҚАЙДАН?" script="менің жерім" at={0} to={2.45} shineAt={1.1} />
          <Karaoke
            top={300}
            phrases={[
              { words: [{ w: "идея", at: 2.52 }, { w: "айтыңызшы", at: 2.7 }], to: 3.38 },
              { words: [{ w: "идеяны", at: 3.38 }, { w: "қайдан", at: 3.78 }, { w: "аласыз", at: 4.18 }], to: 4.5 },
              { words: [{ w: "деп", at: 4.5 }, { w: "сұрап", at: 4.62 }, { w: "жатады", at: 4.86 }], to: 5.45 },
            ]}
          />
          <PhotoCard at={2.9} to={5.1} x={70} y={1180} w={360} h={360} from="left">
            <OffthreadVideo src={staticFile("src2/main4k.mp4")} startFrom={60 * 8} muted style={{ width: 2160 * 0.36, height: 3840 * 0.36, marginLeft: -250, marginTop: -60 }} />
          </PhotoCard>
          <PhoneFlip at={3.6} to={5.45} x={700} y={1040} w={290}>
            <OffthreadVideo src={staticFile("src2/main4k.mp4")} startFrom={60 * 12} muted style={{ width: 2160 * 0.26, height: 3840 * 0.26, marginLeft: -140, marginTop: -60 }} />
          </PhoneFlip>
        </>
      ) : null}
      <Audio src={staticFile("src2/main.mp4")} />
      <Sequence from={Math.round(1.1 * fps)}><Audio src={staticFile("sfx/sparkle.wav")} volume={0.3} /></Sequence>
    </AbsoluteFill>
  );
};
