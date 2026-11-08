import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { ThreeTest } from "./test/Three";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <Composition id="ThreeTest" component={ThreeTest} durationInFrames={60} fps={30} width={1280} height={720} />
    </>
  );
};
