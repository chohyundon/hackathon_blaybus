import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function RenderItem({
  object,
  basePosition,
  rotation,
  id,
  selectedPart,
  setSelectedPart,
}) {
  const ref = useRef();

  // 기준 위치 (절대값)
  const base = useMemo(
    () => new THREE.Vector3(...basePosition),
    [basePosition]
  );

  // 클릭 시 이동 오프셋
  const explodeOffset = useMemo(() => new THREE.Vector3(0, 0, 0.2), []);

  useFrame(() => {
    if (!ref.current) return;

    const target =
      selectedPart?.id === id ? base.clone().add(explodeOffset) : base;

    ref.current.position.lerp(target, 0.07);
  });

  return (
    <group
      ref={ref}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();

        const wp = new THREE.Vector3();
        e.object.getWorldPosition(wp);

        setSelectedPart({
          id,
          worldPos: wp,
        });
      }}>
      <primitive object={object} />
    </group>
  );
}
