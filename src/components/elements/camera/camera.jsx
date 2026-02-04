import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function CameraFocus({ target }) {
  const { camera, controls } = useThree();

  const desiredPos = useRef(new THREE.Vector3());
  const lookAt = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!target || typeof target.x !== "number") return;

    lookAt.current.copy(target);

    // 🔥 target 기준으로 카메라를 "앞에서" 보게 위치 잡기
    desiredPos.current.copy(target).add(new THREE.Vector3(0, 0.15, 0.35));
  }, [target]);

  useFrame(() => {
    if (!target || typeof target.x !== "number") return;

    camera.position.lerp(desiredPos.current, 0.08);

    if (controls) {
      controls.target.lerp(lookAt.current, 0.08);
      controls.update();
    } else {
      camera.lookAt(lookAt.current);
    }
  });

  return null;
}
