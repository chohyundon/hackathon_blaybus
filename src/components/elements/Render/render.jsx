import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const BASE_COLOR = new THREE.Color("#bbbbbb"); // 기본
const ACTIVE_COLOR = new THREE.Color("#ff6b00"); // 선택·이동 시 강조 (주황)
const FOCUS_COLOR = new THREE.Color("#66aaff"); // 카메라 줌(포커스) 시 하이라이트 (파랑)

export default function RenderItem({
  object,
  basePosition,
  rotation,
  id,
  selectedPart,
  setSelectedPart,
  disassemble = 0,
  disassembleOffset = [0, 0, 0],
  /** 클릭 시 카메라 포커스용 좌표. 있으면 클릭 지점 대신 이 [x,y,z] 사용 (예: Pin은 basePosition 넣어서 중심에 맞춤) */
  focusPosition,
}) {
  const ref = useRef();

  const base = useMemo(
    () => new THREE.Vector3(...basePosition),
    [basePosition],
  );
  const explodeOffset = useMemo(() => {
    if (id.startsWith("pin")) {
      return new THREE.Vector3(-0.18, 0, 0.05);
    } else if (id.startsWith("bolt")) {
      return new THREE.Vector3(0, 0, 0.12);
    } else {
      return new THREE.Vector3(0, 0, 0.25);
    }
  }, [id]);

  const explodeDir = useMemo(
    () =>
      new THREE.Vector3(
        disassembleOffset[0] ?? 0,
        disassembleOffset[1] ?? 0,
        disassembleOffset[2] ?? 0,
      ),
    [disassembleOffset],
  );

  const handleClick = (e) => {
    e.stopPropagation();

    let worldPos;
    if (focusPosition && focusPosition.length >= 3) {
      worldPos = {
        x: focusPosition[0],
        y: focusPosition[1],
        z: focusPosition[2],
      };
    } else {
      const wp = new THREE.Vector3();
      e.object.getWorldPosition(wp);
      worldPos = { x: wp.x, y: wp.y, z: wp.z };
    }

    setSelectedPart({
      id,
      worldPos,

      intent:
        id.startsWith("bolt") ||
        id.startsWith("pin") ||
        id.startsWith("rod") ||
        id.startsWith("cap")
          ? "MOVE_OBJECT"
          : "FOCUS_CAMERA",
    });
  };

  useFrame(() => {
    if (!ref.current) return;

    // ---------- 위치: 기본 + 분해 오프셋 + 선택 시 살짝 전진 ----------
    const disassembleDelta = explodeDir.clone().multiplyScalar(disassemble);
    let targetPos = base.clone().add(disassembleDelta);
    if (selectedPart?.id === id && selectedPart.intent === "MOVE_OBJECT") {
      targetPos.add(explodeOffset);
    }
    ref.current.position.lerp(targetPos, 0.07);

    // ---------- 색상 ----------
    let targetColor = BASE_COLOR;

    if (selectedPart?.id === id) {
      targetColor =
        selectedPart.intent === "MOVE_OBJECT" ? ACTIVE_COLOR : FOCUS_COLOR;
    }

    ref.current.traverse((child) => {
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];

        materials.forEach((mat) => {
          if (mat.color) {
            mat.color.lerp(targetColor, 0.05);
          }
        });
      }
    });
  });

  return (
    <group ref={ref} rotation={rotation} onClick={handleClick}>
      <primitive object={object} />
    </group>
  );
}
