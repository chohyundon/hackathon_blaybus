import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { useState } from "react";
import V4Screen from "../v4";
import CameraFocus from "../camera/camera";

export default function Scene() {
  const [selectedPart, setSelectedPart] = useState(null);

  return (
    <Canvas
      camera={{ position: [-11, 10, 10], fov: 3, near: 1, far: 1000 }}
      gl={{ antialias: true }}
      onPointerMissed={() => setSelectedPart(null)}>
      <ambientLight intensity={0.6} />
      <OrbitControls makeDefault />
      <Environment preset="sunset" />

      {selectedPart && <CameraFocus selectedPart={selectedPart} />}
      <V4Screen selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
    </Canvas>
  );
}
