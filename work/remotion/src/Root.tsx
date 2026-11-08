import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { ThreeTest } from "./test/Three";
import { StyleTest } from "./style/StyleTest";
import { Main } from "./edit/Main";
import { FPS, DURATION } from "./edit/data";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <Composition id="ThreeTest" component={ThreeTest} durationInFrames={60} fps={30} width={1280} height={720} />
      <Composition id="StyleTest" component={StyleTest} durationInFrames={60} fps={30} width={1080} height={1920} />
      <Composition id="Main" component={Main} durationInFrames={Math.round(DURATION * FPS)} fps={FPS} width={1080} height={1920} />
    </>
  );
};
