import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";
export const ThreeTest: React.FC = () => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  return (<AbsoluteFill style={{ background: "#111" }}>
    <ThreeCanvas width={width} height={height}>
      <ambientLight intensity={0.4} /><pointLight position={[5, 5, 5]} intensity={80} />
      <mesh rotation={[f * 0.05, f * 0.07, 0]}><boxGeometry args={[2, 2, 2]} /><meshStandardMaterial color="#ff5a36" /></mesh>
    </ThreeCanvas></AbsoluteFill>);
};
