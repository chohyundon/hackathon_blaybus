import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import V4Screen from "../object/v4";
import RobotArms from "../object/robotArm";
import Drone from "../object/drone";
import CameraFocus from "../camera/camera";
import styles from "./scene.module.css";
import icon_arrow from "../../../assets/icon_arrow-up.svg";
import SideScene from "./sideScene";
import Suspension from "../object/suspension";
import Header from "../../header/Header";
import { useMemoStore } from "../../../store/useMemoStore";
import Memo from "../../memo/Memo";
import ZoomInIcon from "../../../assets/ZoomButton.svg";
import Zoom from "../../../zoom/Zoom";

/** 탭 전환 시 카메라 위치·FOV 갱신 (Canvas의 camera prop은 최초 1회만 적용됨) */
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
      camera.fov = 3.5;
    }
    camera.updateProjectionMatrix();
  }, [selectedObject, camera]);
  return null;
}

export default function Scene() {
  const [selectedPart, setSelectedPart] = useState(null);
  const [disassemble, setDisassemble] = useState(0); // 0 = 합체, 1 = 분해
  const [selectedObject, setSelectedObject] = useState("V4_Engine");
  const [active, setActive] = useState("memo");
  const [textValue, setTextValue] = useState("");
  const [aiValue, setAiValue] = useState("");
  const [sendAi, setSendAi] = useState(false);
  const [selected, setSelected] = useState("수동조절");
  const rangeRef = useRef(null);
  const controlsRef = useRef();
  const canvasWrapperRef = useRef(null);
  const sideSceneRef = useRef(null);
  const [showService, setShowService] = useState(false);
  const setMemos = useMemoStore((state) => state.setMemos);
  const memoStore = useMemoStore((state) => state.memos);
  const [zoomIn, setZoomIn] = useState(false);
  const [controlsActive, setControlsActive] = useState(false);
  const controlsEndTimeoutRef = useRef(null);

  useEffect(() => {
    if (!rangeRef.current) return;

    rangeRef.current.style.setProperty(
      "--range-progress",
      `${disassemble * 100}%`
    );
  }, [disassemble]);

  // 바깥 영역 클릭 시 선택 해제 (서스펜션 포함 모든 오브젝트)
  useEffect(() => {
    const handleClickOutside = (e) => {
      const inCanvas = canvasWrapperRef.current?.contains(e.target);
      const inSideScene = sideSceneRef.current?.contains(e.target);
      if (!inCanvas && !inSideScene) {
        setSelectedPart(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChangeValue = (e) => {
    setTextValue(e.target.value);
  };

  const handleAiValue = (e) => {
    setAiValue(e.target.value);
  };

  const handleSaveMemo = () => {
    setMemos([
      ...memoStore,
      {
        text: textValue,
        object: selectedObject,
        date: new Date().toLocaleDateString(),
      },
    ]);
    setTextValue("");
  };

  const handleZoomIn = () => {
    console.log("zoom in");
    setZoomIn((prev) => !prev);
  };

  return (
    <main className={styles.mainContainer}>
      {zoomIn ? (
        <Zoom
          setZoomIn={setZoomIn}
          selectedObject={selectedObject}
          selectedPart={selectedPart}
          setSelectedPart={setSelectedPart}
          disassemble={disassemble}
        />
      ) : (
        <>
          <Header
            showService={showService}
            setShowService={setShowService}
            selectedObject={selectedObject}
            setSelectedObject={setSelectedObject}
          />
          <div className={styles.sceneContainer}>
            <img
              src={ZoomInIcon}
              width={40}
              height={40}
              className={styles.zoomInIcon}
              onClick={handleZoomIn}
            />
            <div className={styles.bottomButtonContainer}>
              <div className={styles.percentContainer}>
                <p className={styles.percent}>0%</p>
                <p className={styles.percent}>100%</p>
              </div>
              <input
                ref={rangeRef}
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={disassemble}
                className={styles.rangeBar}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  e.currentTarget.style.setProperty(
                    "--range-progress",
                    `${value * 100}%`
                  );

                  setDisassemble(value);
                  // 슬라이더를 움직이면 수동조절로 전환
                  if (selected === "완전분해" || selected === "완전결합") {
                    setSelected("수동조절");
                  }
                }}
              />
              <div className={styles.buttonContent}>
                <button
                  className={
                    selected === "수동조절"
                      ? styles.bottomActive
                      : styles.bottomButton
                  }
                  onClick={() => {
                    setSelected("수동조절");
                  }}>
                  수동조절
                </button>

                <button
                  className={
                    selected === "완전분해"
                      ? styles.bottomActive
                      : styles.bottomButton
                  }
                  onClick={() => {
                    setSelected("완전분해");
                    setDisassemble(1);
                  }}>
                  완전분해
                </button>

                <button
                  className={
                    selected === "완전결합"
                      ? styles.bottomActive
                      : styles.bottomButton
                  }
                  onClick={() => {
                    setSelected("완전결합");
                    setDisassemble(0);
                  }}>
                  완전결합
                </button>
              </div>
            </div>
            <div ref={canvasWrapperRef} className={styles.canvasWrapper}>
              <Canvas
                camera={{ position: [-11, 10, 10], fov: 3, near: 1, far: 1000 }}
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
            <div ref={sideSceneRef}>
              <SideScene
                selectedPart={selectedPart}
                selectedObject={selectedObject}
                setSelectedPart={setSelectedPart}
              />
            </div>
          </div>
          <div className={styles.controlsContainer}>
            <aside className={styles.ai}>
              <p className={styles.aiTitle}>AI 어시스턴트</p>
              <div className={styles.aiInputText}>
                {/* 유저 메시지 */}
                {sendAi && aiValue.trim() !== "" && (
                  <div className={`${styles.message} ${styles.userSend}`}>
                    {aiValue}
                  </div>
                )}

                {/* AI 메시지 */}
                <div className={`${styles.message} ${styles.aiText}`}>
                  ~~대한민국의 경제질서는 개인과 기업의 경제상의 자유와 창의를
                  존중함을 기본으로 한다. 모든 국민은 헌법과 법률이 정한 법관에
                  의하여 법률에 의한 재판을 받을 권리를 가진다.
                </div>
              </div>
              <div className={styles.inputContainer}>
                <input
                  id="input"
                  placeholder="무엇이 궁금하신가요?"
                  className={styles.input}
                  value={aiValue}
                  onChange={handleAiValue}
                />
                <img
                  src={icon_arrow}
                  width={24}
                  height={24}
                  className={styles.arrowIcon}
                  onClick={() => setSendAi(true)}
                />
              </div>
            </aside>
            <aside className={styles.memoContainer}>
              <div className={styles.memoHeader}>
                <p
                  className={`${styles.tab} ${
                    active === "memo" ? styles.tabActive : styles.tabInactive
                  }`}
                  onClick={() => setActive("memo")}>
                  메모장
                </p>

                <p
                  className={`${styles.tab} ${
                    active === "all" ? styles.tabActive : styles.tabInactive
                  }`}
                  onClick={() => setActive("all")}>
                  전체메모
                </p>
              </div>
              <div className={styles.textSection}>
                {active === "memo" ? (
                  <div className={styles.textAreaContainer}>
                    <textarea
                      id="textArea"
                      placeholder="학습내용이나 아이디어를 남겨보세요"
                      className={styles.textArea}
                      value={textValue}
                      onChange={handleChangeValue}
                    />
                    <div className={styles.buttonContainer}>
                      <button className={styles.cancel}>취소</button>
                      <button className={styles.okay} onClick={handleSaveMemo}>
                        확인
                      </button>
                    </div>
                  </div>
                ) : (
                  <Memo />
                )}
              </div>
            </aside>
          </div>
        </>
      )}
    </main>
  );
}
