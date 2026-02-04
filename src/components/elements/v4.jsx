import { useMemo, useState } from "react";
import * as THREE from "three";
import { useGLTF, Html } from "@react-three/drei";
import RenderItem from "./Render/render";

/** clone한 scene의 모든 mesh에 메탈 재질 적용. primitive는 material prop을 안 먹으므로 꼭 필요 */
function cloneWithMetalMaterial(
  scene,
  metalness = 0.9,
  roughness = 0.12,
  color
) {
  const cloned = scene.clone(true);
  cloned.traverse((child) => {
    if (child.isMesh && child.material) {
      const baseColor = color ?? child.material.color?.clone?.() ?? 0x888888;
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

/* GLB는 ?url 로 경로만 가져오고, useGLTF(url) 로 로드 */
import crankshaftUrl from "../../assets/3DAsset/V4_Engine/Crankshaft.glb?url";
import connectingRodUrl from "../../assets/3DAsset/V4_Engine/Connecting Rod.glb?url";
import connectingRodCapUrl from "../../assets/3DAsset/V4_Engine/Connecting Rod Cap.glb?url";
import conrodBoltUrl from "../../assets/3DAsset/V4_Engine/Conrod Bolt.glb?url";
import pistonPinUrl from "../../assets/3DAsset/V4_Engine/Piston Pin.glb?url";
import pistonRingUrl from "../../assets/3DAsset/V4_Engine/Piston Ring.glb?url";
import pistonUrl from "../../assets/3DAsset/V4_Engine/Piston.glb?url";
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
} from "../../consts/v4";

const URLS = {
  crankshaft: crankshaftUrl,
  rod: connectingRodUrl,
  rodCap: connectingRodCapUrl,
  bolt: conrodBoltUrl,
  pin: pistonPinUrl,
  ring: pistonRingUrl,
  piston: pistonUrl,
};

const METALNESS = 0.9;
const ROUGHNESS = 0.12;

export default function V4Screen() {
  const crankshaft = useGLTF(URLS.crankshaft);
  const rod = useGLTF(URLS.rod);
  const rodCap = useGLTF(URLS.rodCap);
  const bolt = useGLTF(URLS.bolt);
  const pin = useGLTF(URLS.pin);
  const piston = useGLTF(URLS.piston);
  const ring = useGLTF(URLS.ring);

  const [selectedPart, setSelectedPart] = useState(null);

  const crankshaftMetal = useMemo(
    () => cloneWithMetalMaterial(crankshaft.scene, METALNESS, ROUGHNESS),
    [crankshaft.scene]
  );
  const rodClones = useMemo(
    () =>
      CYLINDER_ROD_POSITIONS.map(() =>
        cloneWithMetalMaterial(rod.scene, METALNESS, ROUGHNESS, "#ffffff")
      ),
    [rod.scene]
  );
  const rodCapClones = useMemo(
    () =>
      CYLINDER_ROD_CAP_POSITIONS.map(() =>
        cloneWithMetalMaterial(rodCap.scene, METALNESS, ROUGHNESS)
      ),
    [rodCap.scene]
  );
  const boltClones = useMemo(
    () =>
      BOLT_OFFSETS_PER_CAP.map(() =>
        cloneWithMetalMaterial(bolt.scene, METALNESS, ROUGHNESS)
      ),
    [bolt.scene]
  );
  const pinClones = useMemo(
    () =>
      CYLINDER_PIN_POSITIONS.map(() =>
        cloneWithMetalMaterial(pin.scene, METALNESS, ROUGHNESS)
      ),
    [pin.scene]
  );
  const pistonClones = useMemo(
    () =>
      CYLINDER_PISTON_POSITIONS.map(() =>
        cloneWithMetalMaterial(piston.scene, METALNESS, ROUGHNESS)
      ),
    [piston.scene]
  );
  const ringClones = useMemo(
    () =>
      CYLINDER_PISTON_RING_POSITIONS.map(() =>
        cloneWithMetalMaterial(ring.scene, METALNESS, ROUGHNESS, "#000000")
      ),
    [ring.scene]
  );

  const tryPistonZoom = () => {
    const pos = CYLINDER_PISTON_POSITIONS[0];
    setSelectedPart({
      id: "piston-0",
      worldPos: new THREE.Vector3(pos[0], pos[1], pos[2]),
    });
  };

  return (
    <group>
      <Html position={[0.3, 0.25, 0]} center style={{ pointerEvents: "auto" }}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            tryPistonZoom();
          }}
          style={{
            padding: "8px 12px",
            fontSize: 12,
            cursor: "pointer",
            border: "1px solid #333",
            borderRadius: 6,
            background: "#fff",
          }}>
          피스톤 확대 테스트
        </button>
      </Html>
      <primitive object={crankshaftMetal} position={[-0.3, 0, 0]} />
      {CYLINDER_ROD_POSITIONS.map((position, index) => (
        <RenderItem
          key={index}
          object={rodClones[index]}
          basePosition={position}
          rotation={CYLINDER_ROD_ROTATION[index]}
          id={`rod-${index}`}
          selectedPart={selectedPart}
          setSelectedPart={setSelectedPart}
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
        />
      ))}
    </group>
  );
}
