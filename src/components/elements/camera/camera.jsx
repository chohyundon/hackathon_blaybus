import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const DEFAULT_POSITION = new THREE.Vector3(-11, 10, 10);
const DEFAULT_LOOKAT = new THREE.Vector3(0, 0, 0);
const CLOSE_ENOUGH = 0.1;

export default function CameraFocus({ target }) {
  const { camera, controls } = useThree();
  const defaultPosStored = useRef(false);
  const returnDone = useRef(false);

  if (!defaultPosStored.current && controls) {
    DEFAULT_POSITION.copy(camera.position);
    DEFAULT_LOOKAT.copy(controls.target);
    defaultPosStored.current = true;
  }

  useFrame(() => {
    const hasTarget = target && typeof target.x === "number";

    if (hasTarget) {
      returnDone.current = false;
      const lookAt = new THREE.Vector3(target.x, target.y, target.z);
      const desiredPos = lookAt.clone().add(new THREE.Vector3(-11, 6, 6));
      camera.position.lerp(desiredPos, 0.08);
      if (controls) {
        controls.target.lerp(lookAt, 0.08);
        controls.update();
      } else {
        camera.lookAt(lookAt);
      }
      return;
    }

    // 바깥 클릭 → 원래 위치로 복귀 (한 번만, 복귀 끝나면 OrbitControls에 맡김)
    if (returnDone.current) return;
    camera.position.lerp(DEFAULT_POSITION, 0.08);
    if (controls) {
      controls.target.lerp(DEFAULT_LOOKAT, 0.08);
      controls.update();
    }
    const distPos = camera.position.distanceTo(DEFAULT_POSITION);
    const distTarget = controls
      ? controls.target.distanceTo(DEFAULT_LOOKAT)
      : 0;
    if (distPos < CLOSE_ENOUGH && distTarget < CLOSE_ENOUGH) {
      returnDone.current = true;
    }
  });

  return null;
}
