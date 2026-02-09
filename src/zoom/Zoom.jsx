import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import styles from "./zoom.module.css";
import ZoomOutIcon from "../assets/ZoomOut.svg";
import V4Screen from "../components/elements/object/v4";
import RobotArms from "../components/elements/object/robotArm";
import Drone from "../components/elements/object/drone";
import Suspension from "../components/elements/object/suspension";
import CameraFocus from "../components/elements/camera/camera";
import arrowDown from "../assets/dropdown.png";

/** 탭 전환 시 카메라 위치·FOV 갱신 */
function CameraByObject({ selectedObject }) {
  const { camera } = useThree();
  useEffect(() => {
    if (selectedObject === "Robot Arm") {
      camera.position.set(-11, 12, 10);
      camera.fov = 3.7;
    } else if (selectedObject === "Drone") {
      camera.position.set(5, 5, 7);
      camera.fov = 3.5;
    } else if (selectedObject === "Suspension") {
      camera.position.set(-11, 15, 10);
      camera.fov = 1;
    } else {
      camera.position.set(-11, 10, 10);
      camera.fov = 2.5;
    }
    camera.updateProjectionMatrix();
  }, [selectedObject, camera]);
  return null;
}

export default function Zoom({
  setZoomIn,
  selectedObject,
  selectedPart,
  setSelectedPart,
  disassemble,
}) {
  const controlsRef = useRef();
  const [controlsActive, setControlsActive] = useState(false);
  const controlsEndTimeoutRef = useRef(null);
  const [selectedButton, setSelectedButton] = useState("수동조절");
  const [rangeValue, setRangeValue] = useState(0);

  const handleZoomOut = () => {
    setZoomIn(false);
  };
  const handleSelectedButton = (button) => {
    setSelectedButton(button);
  };
  return (
    <div className={styles.zoomContainer}>
      <img
        src={ZoomOutIcon}
        width={40}
        height={40}
        onClick={handleZoomOut}
        className={styles.zoomInIcon}
        alt="줌 아웃"
      />
      <div className={styles.canvasArea}>
        <Canvas
          camera={{ position: [0, 0, 0], fov: 1, near: 1, far: 1000 }}
          gl={{ antialias: true }}
          shadows
          className={styles.canvas}
          onPointerMissed={() => setSelectedPart(null)}>
          <CameraByObject selectedObject={selectedObject} />
          <directionalLight
            intensity={1.4}
            position={[10, 10, 10]}
            castShadow
          />
          <ambientLight intensity={1.2} />
          <directionalLight position={[-5, 8, 5]} intensity={0.5} />
          <directionalLight position={[0, 12, 0]} intensity={0.4} />
          <Environment preset="sunset" />
          <OrbitControls
            makeDefault
            ref={controlsRef}
            minDistance={2}
            maxDistance={80}
            enableDamping
            dampingFactor={0.05}
            onStart={() => {
              if (controlsEndTimeoutRef.current) {
                clearTimeout(controlsEndTimeoutRef.current);
                controlsEndTimeoutRef.current = null;
              }
              setControlsActive(true);
            }}
            onEnd={() => {
              controlsEndTimeoutRef.current = setTimeout(
                () => setControlsActive(false),
                400
              );
            }}
          />
          <CameraFocus
            target={
              selectedPart?.intent === "FOCUS_CAMERA" &&
              selectedPart?.worldPos &&
              !selectedPart?.id?.startsWith("robot-")
                ? selectedPart.worldPos
                : null
            }
            controlsRef={controlsRef}
            selectedObject={selectedObject}
            enableFocus={!controlsActive}
          />
          <Suspense fallback={null}>
            {selectedObject === "Robot Arm" ? (
              <RobotArms
                selectedPart={selectedPart}
                setSelectedPart={setSelectedPart}
                disassemble={disassemble}
              />
            ) : selectedObject === "Drone" ? (
              <Drone
                selectedPart={selectedPart}
                setSelectedPart={setSelectedPart}
                disassemble={disassemble}
              />
            ) : selectedObject === "Suspension" ? (
              <Suspension
                selectedPart={selectedPart}
                setSelectedPart={setSelectedPart}
                disassemble={disassemble}
              />
            ) : (
              <V4Screen
                selectedPart={selectedPart}
                setSelectedPart={setSelectedPart}
                disassemble={disassemble}
              />
            )}
          </Suspense>
        </Canvas>
      </div>
      <div className={styles.rightArea}>
        <div className={styles.rightAreaHeader}>
          <h1 className={styles.rightAreaTitle}>V4_Engine</h1>
          <img src={arrowDown} alt="zoom in" />
        </div>
        <div className={styles.rightAreaButtonContainer}>
          <p
            className={
              selectedButton === "수동조절"
                ? styles.rightAreaButtonActive
                : styles.rightAreaButton
            }
            onClick={() => handleSelectedButton("수동조절")}>
            수동조절
          </p>
          <p
            className={
              selectedButton === "완전분해"
                ? styles.rightAreaButtonActive
                : styles.rightAreaButton
            }
            onClick={() => handleSelectedButton("완전분해")}>
            완전분해
          </p>
          <p
            className={
              selectedButton === "완전결합"
                ? styles.rightAreaButtonActive
                : styles.rightAreaButton
            }
            onClick={() => handleSelectedButton("완전결합")}>
            완전결합
          </p>
        </div>
      </div>
    </div>
  );
}
