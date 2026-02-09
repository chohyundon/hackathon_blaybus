import { useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import RenderItem from "../Render/render";

import baseUrl from "../../../assets/3DAsset/Suspension/BASE.glb?url";
import nutUrl from "../../../assets/3DAsset/Suspension/NUT.glb?url";
import rodUrl from "../../../assets/3DAsset/Suspension/ROD.glb?url";
import springUrl from "../../../assets/3DAsset/Suspension/SPRING.glb?url";

function cloneWithMetalMaterial(
  scene,
  metalness = 0.7,
  roughness = 0.15,
  color
) {
  const cloned = scene.clone(true);
  cloned.traverse((child) => {
    if (child.isMesh && child.material) {
      const baseColor = color ?? child.material.color?.clone?.();
      child.material = new THREE.MeshStandardMaterial({
        color: baseColor,
        metalness,
        roughness,
        envMapIntensity: 1.2,
      });
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return cloned;
}

const METALNESS = 0.7;
const ROUGHNESS = 0.15;

const URLS = {
  base: baseUrl,
  nut: nutUrl,
  rod: rodUrl,
  spring: springUrl,
};

const PART_IDS = ["base", "nut", "rod", "spring"];

// 조립도 기준 배치 (조정 가능)
const SUSPENSION_POSITIONS = [
  [-0.07, 0, 0], // base
  [0.01, 0.0565, -0.0065], // nut
  [0.01, 0.052, -0.0065], // rod
  [-0.07, 0.001, 0.001], // spring
];

const SUSPENSION_ROTATIONS = [
  [0, 3.2, 1],
  [0, 3.2, 1],
  [0, 3.2, 1],
  [0, 3.2, 1],
];

// 분해 시 일자로 위쪽으로만 분리 (Y축 일직선)
const DISASSEMBLE_OFFSETS = [
  [0, 0, 0], // base: 고정
  [0, 0.02, 0.05], // spring
  [0, 0.07, 0], // rod
  [0, 0.2, 0], // nut
];

export default function Suspension({
  selectedPart,
  setSelectedPart,
  disassemble = 0,
}) {
  const base = useGLTF(URLS.base);
  const nut = useGLTF(URLS.nut);
  const rod = useGLTF(URLS.rod);
  const spring = useGLTF(URLS.spring);

  const scenes = [base, nut, rod, spring];

  const clones = useMemo(
    () =>
      scenes.map((gltf) =>
        cloneWithMetalMaterial(gltf.scene, METALNESS, ROUGHNESS)
      ),
    [base, nut, rod, spring]
  );

  return (
    <group>
      {PART_IDS.map((id, index) => (
        <RenderItem
          key={id}
          object={clones[index]}
          basePosition={SUSPENSION_POSITIONS[index]}
          rotation={SUSPENSION_ROTATIONS[index]}
          id={`suspension-${id}`}
          selectedPart={selectedPart}
          setSelectedPart={setSelectedPart}
          disassemble={disassemble}
          disassembleOffset={DISASSEMBLE_OFFSETS[index]}
        />
      ))}
    </group>
  );
}
