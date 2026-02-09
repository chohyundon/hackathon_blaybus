import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const CLOSE_ENOUGH = 0.1;

export default function CameraFocus({
  target,
  controlsRef,
  enableFocus = true,
}) {
  const { camera } = useThree();

  const defaultPos = useRef(new THREE.Vector3());
  const defaultTarget = useRef(new THREE.Vector3());
  const stored = useRef(false);
  const returnDone = useRef(false);

  useFrame(() => {
    if (!enableFocus) return;

    const controls = controlsRef?.current;
    if (!controls) return;

    // 최초 기본 위치 저장
    if (!stored.current) {
      defaultPos.current.copy(camera.position);
      defaultTarget.current.copy(controls.target);
      stored.current = true;
    }

    const hasTarget = target && typeof target.x === "number";

    if (hasTarget) {
      returnDone.current = false;

      const lookAt = new THREE.Vector3(target.x, target.y, target.z);
      const desiredPos = lookAt.clone().add(new THREE.Vector3(-11, 6, 6));

      camera.position.lerp(desiredPos, 0.08);
      controls.target.lerp(lookAt, 0.08);
      controls.update();
      return;
    }

    if (returnDone.current) return;

    camera.position.lerp(defaultPos.current, 0.08);
    controls.target.lerp(defaultTarget.current, 0.08);
    controls.update();

    if (
      camera.position.distanceTo(defaultPos.current) < CLOSE_ENOUGH &&
      controls.target.distanceTo(defaultTarget.current) < CLOSE_ENOUGH
    ) {
      returnDone.current = true;
    }
  });

  return null;
}
