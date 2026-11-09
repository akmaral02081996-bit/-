import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useVideoConfig } from "remotion";
import { useFontsReady } from "../edit/Captions";
import { BrushWord, FeatherCard, FlowerWord, SerifTitle, WhiteLine } from "./kit";

// Тест стиля №4 на кадрах распаковки (временно)
export const StyleTest4: React.FC = () => {
  const { fps } = useVideoConfig();
  const ready = useFontsReady();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <OffthreadVideo src={staticFile("src3/main.mp4")} startFrom={Math.round(5.7 * fps)} style={{ width: 1080, height: 1920 }} />
      {ready ? (
        <>
          <div style={{ position: "absolute", left: 120, top: 1020 }}><BrushWord text="Ең бірінші" at={0.1} to={2.4} size={120} /></div>
          <div style={{ position: "absolute", left: 160, top: 1160 }}><WhiteLine words={[["менің", 1.1], ["ең", 1.5], ["қалаған", 1.9], ["затым", 2.1]]} to={2.4} size={56} /></div>
          <div style={{ position: "absolute", left: 140, top: 1080 }}><SerifTitle text="ОЙЛАНБАЙ АЛДЫМ" at={2.5} to={4.8} size={110} /></div>
          <FlowerWord from={4.9} to={8.4} x={300} y={1300} words={[["блогыма", 4.9], ["жұмысыма", 6.3], ["көмегі", 7.2]]} />
          <FeatherCard at={5.2} to={8.0} x={560} y={980} w={420} h={420}>
            <Img src={staticFile("src3/lark_c.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </FeatherCard>
        </>
      ) : null}
      <Sequence from={Math.round(0.1 * fps)} durationInFrames={40}><Audio src={staticFile("sfx/sparkle.wav")} volume={0.15} /></Sequence>
      <Sequence from={Math.round(4.9 * fps)} durationInFrames={10}><Audio src={staticFile("sfx/bubble.wav")} volume={0.4} /></Sequence>
    </AbsoluteFill>
  );
};
