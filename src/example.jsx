import {
  useMemo,
  useRef,
  useState,
  useCallback,
  createContext,
  useContext,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";

/* ======================= Assets ======================= */
import crankshaftUrl from "./assets/3DAsset/V4_Engine/Crankshaft.glb?url";
import connectingRodUrl from "./assets/3DAsset/V4_Engine/Connecting Rod.glb?url";
import connectingRodCapUrl from "./assets/3DAsset/V4_Engine/Connecting Rod Cap.glb?url";
import conrodBoltUrl from "./assets/3DAsset/V4_Engine/Conrod Bolt.glb?url";
import pistonPinUrl from "./assets/3DAsset/V4_Engine/Piston Pin.glb?url";
import pistonRingUrl from "./assets/3DAsset/V4_Engine/Piston Ring.glb?url";
import pistonUrl from "./assets/3DAsset/V4_Engine/Piston.glb?url";

const U = {
  CRANKSHAFT: crankshaftUrl,
  ROD: connectingRodUrl,
  ROD_CAP: connectingRodCapUrl,
  BOLT: conrodBoltUrl,
  PIN: pistonPinUrl,
  RING: pistonRingUrl,
  PISTON: pistonUrl,
};

/* ======================= Utils ======================= */
const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/* ======================= Context ======================= */
const ExplodeContext = createContext({ isExploded: false });
const useExplode = () => useContext(ExplodeContext);

const PartClickContext = createContext({
  onPartClick: null,
  selectedPart: null,
  selectedPartPosition: null,
  resetView: null,
  resetCameraRequest: false,
  setResetCameraRequest: null,
});
const usePartClick = () => useContext(PartClickContext);

/* ======================= Const ======================= */
const CAMERA_DEFAULT_POSITION = new THREE.Vector3(-11, 10, 10);
const CAMERA_ZOOM_DISTANCE = 4;
const ROD_ROT = [0, Math.PI / 2, 0];
const color = "#aaaaaa";

const BOLT_POSITIONS = [
  { pos: [0, -0.251, -0.04], rot: [0, 1, 0] },
  { pos: [0, -0.251, 0.04], rot: [0, 1, 0] },
  { pos: [0, -0.315, 0.04], rot: [Math.PI, 1, 0] },
  { pos: [0, -0.315, -0.04], rot: [Math.PI, 1, 0] },
];

const RING_POSITIONS = [
  [0, -0.0412, 0],
  [0, -0.0296, 0],
  [0, -0.0528, 0],
];

const CYLINDER_ASSEMBLIES = [
  { base: [0.0005, 0.15, 0], offset: [0.15, 0.25, 0.08] },
  { base: [-0.345, 0.15, 0], offset: [0, 0.22, 0.05] },
  { base: [-0.23, 0.25, 0], offset: [0, 0.18, 0.04] },
  { base: [-0.115, 0.25, 0], offset: [-0.12, 0.18, -0.05] },
];

/* ======================= AnimatedGroup ======================= */
function AnimatedGroup({ basePosition, explodeOffset, children }) {
  const ref = useRef();
  const progress = useRef(0);
  const { isExploded } = useExplode();

  useFrame((_, delta) => {
    const target = isExploded ? 1 : 0;
    progress.current += (target - progress.current) * Math.min(delta * 1.5, 1);
    const t = easeInOutCubic(progress.current);
    ref.current.position.set(
      basePosition[0] + explodeOffset[0] * t,
      basePosition[1] + explodeOffset[1] * t,
      basePosition[2] + explodeOffset[2] * t
    );
  });

  return <group ref={ref}>{children}</group>;
}

/* ======================= CloneWithClick ======================= */
function CloneWithClick({ object, onClick }) {
  if (object.isMesh) {
    return (
      <primitive
        object={object}
        onClick={(e) => {
          e.stopPropagation();
          const pos = new THREE.Vector3();
          e.object.getWorldPosition(pos);
          onClick(e, pos);
        }}
      />
    );
  }
  return (
    <primitive object={object}>
      {object.children.map((c) => (
        <CloneWithClick key={c.uuid} object={c} onClick={onClick} />
      ))}
    </primitive>
  );
}

/* ======================= Model ======================= */
function Model({ url, position, rotation, partName, color }) {
  const { onPartClick } = usePartClick();
  const { scene } = useGLTF(url);

  const clone = useMemo(() => {
    const cloned = scene.clone(true);

    if (color) {
      cloned.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color,
            metalness: 0.8,
            roughness: 0.1,
          });
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
    return cloned;
  }, [scene, color]);

  return (
    <group position={position} rotation={rotation}>
      <CloneWithClick
        object={clone}
        onClick={(e, worldPos) => onPartClick(e, partName, worldPos)}
      />
    </group>
  );
}

/* ======================= CylinderAssembly ======================= */
function CylinderAssembly({ basePosition, explodeOffset, index }) {
  const { onPartClick } = usePartClick();

  return (
    <AnimatedGroup basePosition={basePosition} explodeOffset={explodeOffset}>
      <Model
        url={U.ROD}
        position={[0, -0.08, 0]}
        rotation={ROD_ROT}
        partName={`rod-${index}`}
        color={color}
      />

      <Model
        url={U.ROD_CAP}
        position={[0, -0.28, 0]}
        rotation={ROD_ROT}
        partName={`rodCap-${index}`}
        color={color}
      />

      {BOLT_POSITIONS.map((b, i) => (
        <Model
          key={i}
          url={U.BOLT}
          position={b.pos}
          rotation={b.rot}
          partName={`bolt-${index}-${i}`}
          color={color}
        />
      ))}

      <Model
        url={U.PIN}
        position={[0.04, -0.08, 0]}
        rotation={ROD_ROT}
        partName={`pin-${index}`}
        color={color}
      />

      {RING_POSITIONS.map((p, i) => (
        <Model
          key={i}
          url={U.RING}
          position={p}
          partName={`ring-${index}-${i}`}
          color={color}
        />
      ))}

      <Model
        url={U.PISTON}
        position={[0, -0.108, 0]}
        rotation={ROD_ROT}
        partName={`piston-${index}`}
        color={color}
      />
    </AnimatedGroup>
  );
}

/* ======================= CameraZoom ======================= */
function CameraZoom({ controlsRef }) {
  const { camera } = useThree();
  const { selectedPartPosition, resetCameraRequest, setResetCameraRequest } =
    usePartClick();

  useFrame((_, delta) => {
    if (resetCameraRequest) {
      camera.position.lerp(CAMERA_DEFAULT_POSITION, delta * 4);
      camera.lookAt(0, 0, 0);
      controlsRef.current?.target.lerp(new THREE.Vector3(), 0.2);
      if (camera.position.distanceTo(CAMERA_DEFAULT_POSITION) < 0.05) {
        camera.position.copy(CAMERA_DEFAULT_POSITION);
        setResetCameraRequest(false);
      }
      return;
    }

    if (!selectedPartPosition) return;

    const dir = camera.position.clone().sub(selectedPartPosition).normalize();

    const targetPos = selectedPartPosition
      .clone()
      .add(dir.multiplyScalar(CAMERA_ZOOM_DISTANCE));

    camera.position.lerp(targetPos, delta * 4);
    camera.lookAt(selectedPartPosition);
    controlsRef.current?.target.lerp(selectedPartPosition, 0.2);
  });

  return null;
}

/* ======================= Root ======================= */
export default function Scene() {
  const [isExploded, setIsExploded] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedPartPosition, setSelectedPartPosition] = useState(null);
  const [resetCameraRequest, setResetCameraRequest] = useState(false);

  const controlsRef = useRef();

  const onPartClick = useCallback((_, name, pos) => {
    setSelectedPart(name);
    setSelectedPartPosition(pos.clone());
  }, []);

  const resetView = () => {
    setSelectedPart(null);
    setSelectedPartPosition(null);
    setResetCameraRequest(true);
  };

  console.log(selectedPart);

  return (
    <ExplodeContext.Provider value={{ isExploded }}>
      <PartClickContext.Provider
        value={{
          onPartClick,
          selectedPart,
          selectedPartPosition,
          resetView,
          resetCameraRequest,
          setResetCameraRequest,
        }}>
        <button onClick={() => setIsExploded((p) => !p)}>분해</button>
        <button onClick={resetView}>원래대로</button>

        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "30%",
            zIndex: 1000,
          }}>
          <p>{selectedPart}</p>
          <p>
            크랭크샤프트(crankshaft)는 엔진 안에서 회전을 만들어내는 중심
            축이다.
            <br /> 피스톤이 위아래로 움직이며 생긴 힘을 회전 운동으로 바꿔주는
            역할을 한다. <br />이 회전이 미션과 바퀴로 전달돼 차량이 움직인다.
            <br />
            V4 엔진에서는 네 개 실린더의 힘을 균형 있게 모아 부드럽게 회전시키는
            게 특히 중요하다.
          </p>
        </div>
        <Canvas
          gl={{ antialias: true }}
          camera={{ position: [-10, 10, 10], fov: 3, near: 0.1, far: 1000 }}
          style={{ width: "100%", height: "100%" }}>
          <ambientLight intensity={0.8} />
          <Environment preset="sunset" intensity={0.5} />

          <group position={[-0.5, 0, 0]}>
            <AnimatedGroup
              basePosition={[0, -0.08, 0]}
              explodeOffset={[0, -0.12, 0]}>
              <Model
                url={U.CRANKSHAFT}
                position={[0, 0, 0]}
                partName="crankshaft"
                color={color}
              />
            </AnimatedGroup>
          </group>

          {CYLINDER_ASSEMBLIES.map((c, i) => (
            <CylinderAssembly
              key={i}
              basePosition={c.base}
              explodeOffset={c.offset}
              index={i}
            />
          ))}

          <ContactShadows opacity={0.4} scale={5} blur={1.2} />
          <OrbitControls ref={controlsRef} />
          <CameraZoom controlsRef={controlsRef} />
        </Canvas>
      </PartClickContext.Provider>
    </ExplodeContext.Provider>
  );
}
