import { useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import RenderItem from "../Render/render";

/* GLB 경로 — Part2 오타 수정 (?ulr → ?url) */
import baseUrl from "../../../assets/3DAsset/Robot Arm/base.glb?url";
import part2Url from "../../../assets/3DAsset/Robot Arm/Part2.glb?url";
import part3Url from "../../../assets/3DAsset/Robot Arm/Part3.glb?url";
import part4Url from "../../../assets/3DAsset/Robot Arm/Part4.glb?url";
import part5Url from "../../../assets/3DAsset/Robot Arm/Part5.glb?url";
import part6Url from "../../../assets/3DAsset/Robot Arm/Part6.glb?url";
import part7Url from "../../../assets/3DAsset/Robot Arm/Part7.glb?url";
import part8Url from "../../../assets/3DAsset/Robot Arm/Part8.glb?url";

const URLS = {
  base: baseUrl,
  part2: part2Url,
  part3: part3Url,
  part4: part4Url,
  part5: part5Url,
  part6: part6Url,
  part7: part7Url,
  part8: part8Url,
  part9: part8Url,
};

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

// 색상: GLB 원본 그대로 사용 (baseColor 미전달 → RenderItem이 재질 원본 색 유지)

// 로봇팔 부품 배치 (조립도 기준으로 조정 가능)
const ROBOT_ARM_POSITIONS = [
  [0, 0, 0], // base
  [0, 0.082, 0], // part2
  [0, 0.24, 0.15], // part3
  [0, 0.55, -0.126], // part4
  [0, 0.61, 0.165], // part5
  [0, 0.62, 0.31], // part6
  [0, 0.61, 0.36], // part7
  [0.02, 0.6, 0.45], // part8
  [-0.02, 0.6, 0.45], // part9
];

const ROBOT_ARM_ROTATIONS = [
  [0, 0, 0],
  [0, 0, 0],
  [15, 0, 1.5],
  [-0.2, 0, 0],
  [-0.2, 0, 0],
  [-1.4, 0, 0],
  [0.2, 0, 0],
  [1.7, 0, 2.7],
  [1.7, 0, 3.5],
];

const DISASSEMBLE_OFFSETS = [
  [0, 0, 0],
  [0, 0.08, 0],
  [0, 0.1, 0.02],
  [0, 0.1, 0.04],
  [0, 0.08, 0.06],
  [0.06, 0.06, 0.08],
  [0.08, 0.04, 0.1],
  [0.1, 0.02, 0.12],
  [0.1, 0.02, 0.12],
];

const PART_IDS = [
  "base",
  "part2",
  "part3",
  "part4",
  "part5",
  "part6",
  "part7",
  "part8",
  "part9",
];

export default function RobotArms({
  selectedPart,
  setSelectedPart,
  disassemble = 0,
}) {
  const base = useGLTF(URLS.base);
  const part2 = useGLTF(URLS.part2);
  const part3 = useGLTF(URLS.part3);
  const part4 = useGLTF(URLS.part4);
  const part5 = useGLTF(URLS.part5);
  const part6 = useGLTF(URLS.part6);
  const part7 = useGLTF(URLS.part7);
  const part8 = useGLTF(URLS.part8);
  const part9 = useGLTF(URLS.part8);

  const scenes = [base, part2, part3, part4, part5, part6, part7, part8, part9];

  const clones = useMemo(() => {
    const list = scenes.map((gltf) =>
      cloneWithMetalMaterial(gltf.scene, METALNESS, ROUGHNESS)
    );
    // part9: 도형을 X축 기준으로 뒤집어 반대편 대칭으로 표시
    list[8].scale.set(-1, 1, 1);
    return list;
  }, [base, part2, part3, part4, part5, part6, part7, part8]);

  return (
    <group>
      {PART_IDS.map((id, index) => (
        <RenderItem
          key={id}
          object={clones[index]}
          basePosition={ROBOT_ARM_POSITIONS[index]}
          rotation={ROBOT_ARM_ROTATIONS[index]}
          id={`robot-${id}`}
          selectedPart={selectedPart}
          setSelectedPart={setSelectedPart}
          disassemble={disassemble}
          disassembleOffset={DISASSEMBLE_OFFSETS[index]}
        />
      ))}
    </group>
  );
}
