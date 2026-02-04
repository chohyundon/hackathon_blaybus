// import {
//   useMemo,
//   useRef,
//   useState,
//   useCallback,
//   createContext,
//   useContext,
// } from "react";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import {
//   OrbitControls,
//   useGLTF,
//   Environment,
//   ContactShadows,
// } from "@react-three/drei";
// import * as THREE from "three";
// import { partNameToV4Key } from "./utils/utils";

// /* ======================= Assets ======================= */
// import crankshaftUrl from "./assets/3DAsset/V4_Engine/Crankshaft.glb?url";
// import connectingRodUrl from "./assets/3DAsset/V4_Engine/Connecting Rod.glb?url";
// import connectingRodCapUrl from "./assets/3DAsset/V4_Engine/Connecting Rod Cap.glb?url";
// import conrodBoltUrl from "./assets/3DAsset/V4_Engine/Conrod Bolt.glb?url";
// import pistonPinUrl from "./assets/3DAsset/V4_Engine/Piston Pin.glb?url";
// import pistonRingUrl from "./assets/3DAsset/V4_Engine/Piston Ring.glb?url";
// import pistonUrl from "./assets/3DAsset/V4_Engine/Piston.glb?url";
// import { v4 } from "./mock/v4";

// const U = {
//   CRANKSHAFT: crankshaftUrl,
//   ROD: connectingRodUrl,
//   ROD_CAP: connectingRodCapUrl,
//   BOLT: conrodBoltUrl,
//   PIN: pistonPinUrl,
//   RING: pistonRingUrl,
//   PISTON: pistonUrl,
// };

// const CYLINDER_BASE_POSITIONS = [
//   [0.155, 0.15, -0.03],
//   [0.27, 0.24, 0.035],
//   [0.385, 0.24, 0.035],
//   [0.499, 0.15, -0.03],
// ];

// const CYLINDER_ROD_POSITIONS = [
//   [0, Math.PI / 2, -0.15],
//   [0.2, Math.PI / 2, -0.01],
//   [0.2, Math.PI / 2, -0.01],
//   [0, Math.PI / 2, -0.15],
// ];

// const CYLINDER_ROD_CAP_POSITIONS = [
//   [0.155, 0.15, -0.03],
//   [0.27, 0.24, 0.035],
//   [0.385, 0.24, 0.035],
//   [0.499, 0.15, -0.03],
// ];

// const CYLINDER_ROD_CAP_ROTATION = [
//   [0, Math.PI / 2, -0.15],
//   [0.2, Math.PI / 2, -0.01],
//   [0.2, Math.PI / 2, -0.01],
//   [0, Math.PI / 2, -0.15],
// ];

// /* ======================= Utils ======================= */
// const easeInOutCubic = (t) =>
//   t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// /* ======================= Context ======================= */
// const ExplodeContext = createContext({ isExploded: false });
// const useExplode = () => useContext(ExplodeContext);

// const PartClickContext = createContext({});
// const usePartClick = () => useContext(PartClickContext);

// /* ======================= Const ======================= */
// const CAMERA_DEFAULT_POSITION = new THREE.Vector3(-11, 10, 10);
// const CAMERA_ZOOM_DISTANCE = 4;
// const color = "#aaaaaa";
// const selectedColor = "#ff0000";

// /* ======================= AnimatedGroup ======================= */
// function AnimatedGroup({ basePosition, explodeOffset, children }) {
//   const ref = useRef();
//   const progress = useRef(0);
//   const { isExploded } = useExplode();

//   useFrame((_, delta) => {
//     const target = isExploded ? 1 : 0;
//     progress.current += (target - progress.current) * Math.min(delta * 1.5, 1);
//     const t = easeInOutCubic(progress.current);
//     ref.current.position.set(
//       basePosition[0] + explodeOffset[0] * t,
//       basePosition[1] + explodeOffset[1] * t,
//       basePosition[2] + explodeOffset[2] * t
//     );
//   });

//   return <group ref={ref}>{children}</group>;
// }

// /* ======================= CloneWithClick ======================= */
// function CloneWithClick({ object, onClick }) {
//   if (object.isMesh) {
//     return (
//       <primitive
//         object={object}
//         onClick={(e) => {
//           e.stopPropagation();
//           const pos = new THREE.Vector3();
//           e.object.getWorldPosition(pos);
//           onClick(e, pos);
//         }}
//       />
//     );
//   }
//   return (
//     <primitive object={object}>
//       {object.children.map((c) => (
//         <CloneWithClick key={c.uuid} object={c} onClick={onClick} />
//       ))}
//     </primitive>
//   );
// }

// /* ======================= Model ======================= */
// function Model({ url, position, rotation, partName, color }) {
//   const { onPartClick } = usePartClick();
//   const { scene } = useGLTF(url);

//   const clone = useMemo(() => {
//     const cloned = scene.clone(true);
//     cloned.traverse((child) => {
//       if (child.isMesh) {
//         child.material = new THREE.MeshStandardMaterial({
//           color,
//           metalness: 0.8,
//           roughness: 0.1,
//         });
//       }
//     });
//     return cloned;
//   }, [scene, color]);

//   return (
//     <group position={position} rotation={rotation}>
//       <CloneWithClick
//         object={clone}
//         onClick={(e, worldPos) => onPartClick(e, partName, worldPos)}
//       />
//     </group>
//   );
// }

// /* ======================= CylinderAssembly ======================= */
// function CylinderAssembly({ index, explodeProgress }) {
//   const { selectedPart } = usePartClick();

//   // 1️⃣ 실린더 기준 위치
//   const basePos = new THREE.Vector3(...CYLINDER_BASE_POSITIONS[index]);

//   // 2️⃣ 분해 방향
//   const explodeDir = new THREE.Vector3(-0.4, 0.6, 0.2).normalize();

//   // 3️⃣ 진행도 (실린더별 딜레이)
//   const t = Math.max(0, explodeProgress - index * 0.15);

//   // 4️⃣ 위치 계산
//   const rodPos = basePos.clone().add(explodeDir.clone().multiplyScalar(t));

//   const rodCapPos = basePos
//     .clone()
//     .add(explodeDir.clone().multiplyScalar(t * 0.8));

//   // 5️⃣ 회전 계산
//   const rodRot = [
//     CYLINDER_ROD_POSITIONS[index][0] + t * 0.8,
//     CYLINDER_ROD_POSITIONS[index][1],
//     CYLINDER_ROD_POSITIONS[index][2] + t * 0.4,
//   ];

//   const rodCapRot = [
//     CYLINDER_ROD_CAP_ROTATION[index][0],
//     CYLINDER_ROD_CAP_ROTATION[index][1] + t * 0.6,
//     CYLINDER_ROD_CAP_ROTATION[index][2],
//   ];

//   return (
//     <>
//       <Model
//         url={U.ROD}
//         position={rodPos.toArray()}
//         rotation={rodRot}
//         partName={`rod-${index}`}
//         color={selectedPart === `rod-${index}` ? selectedColor : color}
//       />

//       <Model
//         url={U.ROD_CAP}
//         position={rodCapPos.toArray()}
//         rotation={rodCapRot}
//         partName={`rod-cap-${index}`}
//         color={selectedPart === `rod-cap-${index}` ? selectedColor : color}
//       />
//     </>
//   );
// }

// /* ======================= CameraZoom ======================= */
// function CameraZoom({ controlsRef }) {
//   const { camera } = useThree();
//   const { selectedPartPosition } = usePartClick();

//   useFrame((_, delta) => {
//     if (!selectedPartPosition) return;

//     const dir = camera.position.clone().sub(selectedPartPosition).normalize();
//     const target = selectedPartPosition
//       .clone()
//       .add(dir.multiplyScalar(CAMERA_ZOOM_DISTANCE));

//     camera.position.lerp(target, delta * 4);
//     camera.lookAt(selectedPartPosition);
//     controlsRef.current?.target.lerp(selectedPartPosition, 0.2);
//   });

//   return null;
// }

// /* ======================= Root ======================= */
// export default function Scene() {
//   const [isExploded, setIsExploded] = useState(false);
//   const [explodeProgress, setExplodeProgress] = useState(0);
//   const [selectedPart, setSelectedPart] = useState(null);
//   const [selectedPartPosition, setSelectedPartPosition] = useState(null);

//   const engineRef = useRef();
//   const controlsRef = useRef();

//   const onPartClick = useCallback((_, name, pos) => {
//     setSelectedPart(name);
//     setSelectedPartPosition(pos.clone());
//   }, []);

//   return (
//     <ExplodeContext.Provider value={{ isExploded }}>
//       <PartClickContext.Provider
//         value={{ onPartClick, selectedPart, selectedPartPosition }}>
//         {/* UI */}
//         <div style={{ position: "fixed", top: 20, left: 20, zIndex: 10 }}>
//           <input
//             type="range"
//             min={0}
//             max={1}
//             step={0.01}
//             value={explodeProgress}
//             onChange={(e) => setExplodeProgress(Number(e.target.value))}
//           />
//           <button onClick={() => setIsExploded((p) => !p)}>분해</button>
//         </div>

//         <Canvas
//           gl={{ antialias: true }}
//           camera={{ position: [-11, 10, 10], fov: 3, near: 0.1, far: 1000 }}
//           style={{ width: "100vw", height: "100vh" }}>
//           <ambientLight intensity={0.8} />
//           <Environment preset="sunset" intensity={0.5} />

//           {/* 🔥 엔진 전체 */}
//           <group ref={engineRef}>
//             <AnimatedGroup
//               basePosition={[0, -0.08, 0]}
//               explodeOffset={[0, -0.12, 0]}>
//               <Model
//                 url={U.CRANKSHAFT}
//                 position={[0, 0, 0]}
//                 partName="crankshaft"
//                 color={selectedPart === "crankshaft" ? selectedColor : color}
//               />
//             </AnimatedGroup>

//             {[0, 1, 2, 3].map((i) => (
//               <CylinderAssembly
//                 key={i}
//                 index={i}
//                 explodeProgress={explodeProgress}
//               />
//             ))}
//           </group>

//           <OrbitControls ref={controlsRef} />
//           <CameraZoom controlsRef={controlsRef} />
//         </Canvas>
//       </PartClickContext.Provider>
//     </ExplodeContext.Provider>
//   );
// }
