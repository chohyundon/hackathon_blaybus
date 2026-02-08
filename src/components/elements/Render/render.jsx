import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

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
  /** 부품 고유 색상. 없으면 GLB 원본 재질 색 그대로 유지 */
  baseColor,
  /** 클릭(선택) 시 하이라이트 색. 없으면 기본 파랑/주황 사용 */
  focusColor,
  activeColor,
  /** 선택 시 부품을 이동시킬 오프셋 [x,y,z]. 있으면 선택 시 이만큼 더해짐 (예: 드론 부품 전진) */
  selectedOffset,
}) {
  const ref = useRef();
  const originalColorsRef = useRef(new Map());
  const defaultColor = useMemo(
    () =>
      baseColor != null
        ? typeof baseColor === "string" || typeof baseColor === "number"
          ? new THREE.Color(baseColor)
          : Array.isArray(baseColor)
          ? new THREE.Color().setRGB(...baseColor)
          : baseColor
        : null,
    [baseColor]
  );
  const resolvedFocusColor = useMemo(
    () =>
      focusColor != null
        ? typeof focusColor === "string" || typeof focusColor === "number"
          ? new THREE.Color(focusColor)
          : focusColor
        : FOCUS_COLOR,
    [focusColor]
  );
  const resolvedActiveColor = useMemo(
    () =>
      activeColor != null
        ? typeof activeColor === "string" || typeof activeColor === "number"
          ? new THREE.Color(activeColor)
          : activeColor
        : ACTIVE_COLOR,
    [activeColor]
  );

  const base = useMemo(
    () =>
      new THREE.Vector3(
        ...(Array.isArray(basePosition) && basePosition.length >= 3
          ? basePosition
          : [0, 0, 0])
      ),
    [basePosition]
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
        disassembleOffset[2] ?? 0
      ),
    [disassembleOffset]
  );
  const selectedOffsetVec = useMemo(() => {
    if (!selectedOffset || !Array.isArray(selectedOffset)) return null;
    return new THREE.Vector3(
      selectedOffset[0] ?? 0,
      selectedOffset[1] ?? 0,
      selectedOffset[2] ?? 0
    );
  }, [selectedOffset]);

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
    if (selectedPart?.id === id) {
      if (selectedPart.intent === "MOVE_OBJECT") {
        targetPos.add(explodeOffset);
      } else if (selectedOffsetVec) {
        targetPos.add(selectedOffsetVec);
      }
    }
    ref.current.position.lerp(targetPos, 0.07);

    // ---------- 색상 ----------
    const isSelected = selectedPart?.id === id;

    ref.current.traverse((child) => {
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];

        materials.forEach((mat) => {
          if (!mat.color) return;
          if (!originalColorsRef.current.has(mat)) {
            originalColorsRef.current.set(mat, mat.color.clone());
          }
          const highlightColor =
            selectedPart?.intent === "MOVE_OBJECT"
              ? resolvedActiveColor
              : resolvedFocusColor;
          const targetColor = isSelected
            ? highlightColor
            : defaultColor ?? originalColorsRef.current.get(mat);
          mat.color.lerp(targetColor, 0.08);
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
