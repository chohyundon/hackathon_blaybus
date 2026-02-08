import { useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import RenderItem from "../Render/render";

/** clone한 scene의 모든 mesh에 메탈 재질 적용. primitive는 material prop을 안 먹으므로 꼭 필요 */
function cloneWithMetalMaterial(
  scene,
  metalness = 0.8,
  roughness = 0.1,
  color,
) {
  const cloned = scene.clone(true);
  cloned.traverse((child) => {
    if (child.isMesh && child.material) {
      const baseColor = color ?? child.material.color?.clone?.();
      child.material = new THREE.MeshStandardMaterial({
        color: baseColor,
        metalness,
        roughness,
        envMapIntensity: 1.5,
      });
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return cloned;
}

/* GLB는 ?url 로 경로만 가져오고, useGLTF(url) 로 로드 */
import crankshaftUrl from "../../../assets/3DAsset/V4_Engine/Crankshaft.glb?url";
import connectingRodUrl from "../../../assets/3DAsset/V4_Engine/Connecting Rod.glb?url";
import connectingRodCapUrl from "../../../assets/3DAsset/V4_Engine/Connecting Rod Cap.glb?url";
import conrodBoltUrl from "../../../assets/3DAsset/V4_Engine/Conrod Bolt.glb?url";
import pistonPinUrl from "../../../assets/3DAsset/V4_Engine/Piston Pin.glb?url";
import pistonRingUrl from "../../../assets/3DAsset/V4_Engine/Piston Ring.glb?url";
import pistonUrl from "../../../assets/3DAsset/V4_Engine/Piston.glb?url";
import {
  BOLT_OFFSETS_PER_CAP,
  CYLINDER_ROD_CAP_POSITIONS,
  CYLINDER_ROD_POSITIONS,
  CYLINDER_ROD_ROTATION,
  CYLINDER_ROD_CAP_ROTATION,
  CYLINDER_BOLT_ROTATION,
  CYLINDER_PIN_POSITIONS,
  CYLINDER_PIN_ROTATION,
  CYLINDER_PISTON_POSITIONS,
  CYLINDER_PISTON_ROTATION,
  CYLINDER_PISTON_RING_ROTATION,
  CYLINDER_PISTON_RING_POSITIONS,
} from "../../../consts/v4";

const URLS = {
  crankshaft: crankshaftUrl,
  rod: connectingRodUrl,
  rodCap: connectingRodCapUrl,
  bolt: conrodBoltUrl,
  pin: pistonPinUrl,
  ring: pistonRingUrl,
  piston: pistonUrl,
};

const METALNESS = 0.75;
const ROUGHNESS = 0.18;

// 분해 시 부품별 이동 방향 [x, y, z] — 슬라이더 1일 때 이만큼 이동
const DISASSEMBLE_OFFSETS = {
  crankshaft: [0, 0, 0],
  rod: [0, 0.12, 0],
  cap: [0, -0.06, 0],
  bolt: [0, -0.07, 0],
  pin: [0, 0.15, 0],
  piston: [0, 0.21, 0],
  ring: [0, 0.12, 0],
};

export default function V4Screen({
  selectedPart,
  setSelectedPart,
  disassemble = 0,
}) {
  const crankshaft = useGLTF(URLS.crankshaft);
  const rod = useGLTF(URLS.rod);
  const rodCap = useGLTF(URLS.rodCap);
  const bolt = useGLTF(URLS.bolt);
  const pin = useGLTF(URLS.pin);
  const piston = useGLTF(URLS.piston);
  const ring = useGLTF(URLS.ring);

  const STEEL_COLOR = "#8E9194"; // 약간 푸른 회색
  const FORGED_STEEL = "#525252";
  const PISTON_RING_COLOR = "#3F4246"; // 다크 건메탈

  const crankshaftMetal = useMemo(
    () =>
      cloneWithMetalMaterial(
        crankshaft.scene,
        METALNESS,
        ROUGHNESS,
        STEEL_COLOR,
      ),
    [crankshaft.scene],
  );
  const rodClones = useMemo(
    () =>
      CYLINDER_ROD_POSITIONS.map(() =>
        cloneWithMetalMaterial(rod.scene, METALNESS, ROUGHNESS, FORGED_STEEL),
      ),
    [rod.scene],
  );
  const rodCapClones = useMemo(
    () =>
      CYLINDER_ROD_CAP_POSITIONS.map(() =>
        cloneWithMetalMaterial(
          rodCap.scene,
          METALNESS,
          ROUGHNESS,
          FORGED_STEEL,
        ),
      ),
    [rodCap.scene],
  );
  const boltClones = useMemo(
    () =>
      BOLT_OFFSETS_PER_CAP.map(() =>
        cloneWithMetalMaterial(bolt.scene, METALNESS, ROUGHNESS, FORGED_STEEL),
      ),
    [bolt.scene],
  );
  const pinClones = useMemo(
    () =>
      CYLINDER_PIN_POSITIONS.map(() =>
        cloneWithMetalMaterial(pin.scene, METALNESS, ROUGHNESS, FORGED_STEEL),
      ),
    [pin.scene],
  );
  const pistonClones = useMemo(
    () =>
      CYLINDER_PISTON_POSITIONS.map(() =>
        cloneWithMetalMaterial(
          piston.scene,
          METALNESS,
          ROUGHNESS,
          FORGED_STEEL,
        ),
      ),
    [piston.scene],
  );
  const ringClones = useMemo(
    () =>
      CYLINDER_PISTON_RING_POSITIONS.map(() =>
        cloneWithMetalMaterial(
          ring.scene,
          0.35, // metalness ↓
          0.55, // roughness ↑
          PISTON_RING_COLOR,
        ),
      ),
    [ring.scene],
  );

  return (
    <group>
      <RenderItem
        object={crankshaftMetal}
        basePosition={[-0.3, 0, 0]}
        rotation={[0, 0, 0]}
        id="crankshaft"
        selectedPart={selectedPart}
        setSelectedPart={setSelectedPart}
        disassemble={disassemble}
        disassembleOffset={DISASSEMBLE_OFFSETS.crankshaft}
      />
      {CYLINDER_ROD_POSITIONS.map((position, index) => (
        <RenderItem
          key={index}
          object={rodClones[index]}
          basePosition={position}
          rotation={CYLINDER_ROD_ROTATION[index]}
          id={`rod-${index}`}
          selectedPart={selectedPart}
          setSelectedPart={setSelectedPart}
          disassemble={disassemble}
          disassembleOffset={DISASSEMBLE_OFFSETS.rod}
        />
      ))}
      {CYLINDER_ROD_CAP_POSITIONS.map((position, index) => (
        <RenderItem
          key={index}
          object={rodCapClones[index]}
          basePosition={position}
          id={`cap-${index}`}
          rotation={CYLINDER_ROD_CAP_ROTATION[index]}
          selectedPart={selectedPart}
          setSelectedPart={setSelectedPart}
          disassemble={disassemble}
          disassembleOffset={DISASSEMBLE_OFFSETS.cap}
        />
      ))}
      {BOLT_OFFSETS_PER_CAP.map((position, index) => (
        <RenderItem
          key={index}
          object={boltClones[index]}
          basePosition={position}
          id={`bolt-${index}`}
          rotation={CYLINDER_BOLT_ROTATION[index]}
          selectedPart={selectedPart}
          setSelectedPart={setSelectedPart}
          disassemble={disassemble}
          disassembleOffset={DISASSEMBLE_OFFSETS.bolt}
        />
      ))}
      {CYLINDER_PIN_POSITIONS.map((position, index) => (
        <RenderItem
          key={index}
          object={pinClones[index]}
          basePosition={position}
          id={`pin-${index}`}
          rotation={CYLINDER_PIN_ROTATION[index]}
          selectedPart={selectedPart}
          setSelectedPart={setSelectedPart}
          disassemble={disassemble}
          disassembleOffset={DISASSEMBLE_OFFSETS.pin}
        />
      ))}
      {CYLINDER_PISTON_POSITIONS.map((position, index) => (
        <RenderItem
          key={index}
          object={pistonClones[index]}
          basePosition={position}
          id={`piston-${index}`}
          rotation={CYLINDER_PISTON_ROTATION[index]}
          selectedPart={selectedPart}
          setSelectedPart={setSelectedPart}
          disassemble={disassemble}
          disassembleOffset={DISASSEMBLE_OFFSETS.piston}
        />
      ))}
      {CYLINDER_PISTON_RING_POSITIONS.map((position, index) => (
        <RenderItem
          key={index}
          object={ringClones[index]}
          basePosition={position}
          id={`ring-${index}`}
          rotation={CYLINDER_PISTON_RING_ROTATION[index]}
          selectedPart={selectedPart}
          setSelectedPart={setSelectedPart}
          disassemble={disassemble}
          disassembleOffset={DISASSEMBLE_OFFSETS.ring}
        />
      ))}
    </group>
  );
}
