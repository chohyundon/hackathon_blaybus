import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import V4Screen from "../v4";
import CameraFocus from "../camera/camera";
import styles from "./scene.module.css";
import { object } from "../../../consts/object";
import closeIcon from "../../../assets/closeIcon.svg";
import icon_arrow from "../../../assets/icon_arrow-up.svg";
import dropdown from "../../../assets/dropdown.png";

export default function Scene() {
  const [selectedPart, setSelectedPart] = useState(null);
  const [disassemble, setDisassemble] = useState(0); // 0 = 합체, 1 = 분해
  const [selectedObject, setSelectedObject] = useState("V4_Engine");
  const [active, setActive] = useState("memo");
  const [textValue, setTextValue] = useState("");
  const [aiValue, setAiValue] = useState("");
  const [sendAi, setSendAi] = useState(false);
  const [show, setShow] = useState(false);

  const baseName = selectedPart?.id?.split("-")[0];
  const mockId = baseName === "cap" ? "rodCap" : baseName;

  const handleChangeValue = (e) => {
    setTextValue(e.target.value);
  };

  const handleAiValue = (e) => {
    setAiValue(e.target.value);
  };

  console.log(mockId);
  console.log(textValue);
  console.log(aiValue.trim() !== "");
  console.log(sendAi);

  const handleModal = () => {
    setShow((prev) => !prev);
  };

  return (
    <main className={styles.mainContainer}>
      <nav className={styles.content}>
        <div className={styles.titleContainer}>
          <img src="/" className={styles.img} />
          <p className={styles.title}>SIMVEX</p>
          <p className={styles.description}>서비스 자세히보기</p>
          <div className={styles.option}>
            {object.map((item, index) => (
              <p
                key={index}
                className={
                  selectedObject === item ? styles.item : styles.noneItem
                }
                onClick={() => setSelectedObject(item)}
              >
                {item}
              </p>
            ))}
          </div>
        </div>
      </nav>
      <div className={styles.sceneContainer}>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={disassemble}
          className={styles.rangeBar}
          onChange={(e) => setDisassemble(Number(e.target.value))}
        />
        <Canvas
          camera={{ position: [-11, 10, 10], fov: 2.2, near: 1, far: 1000 }}
          gl={{ antialias: true }}
          onPointerMissed={() => setSelectedPart(null)}
          style={{
            width: "679px",
            height: "679px",
            border: "1px solid red",
            marginTop: "40px",
            marginInline: "40px",
          }}
        >
          <directionalLight intensity={0.5} position={[10, 10, 10]} />
          <ambientLight intensity={0.7} />
          <OrbitControls makeDefault />
          <Environment preset="sunset" />
          <CameraFocus
            target={
              selectedPart?.intent === "FOCUS_CAMERA" && selectedPart?.worldPos
                ? selectedPart.worldPos
                : null
            }
          />
          <Suspense fallback={null}>
            <V4Screen
              selectedPart={selectedPart}
              setSelectedPart={setSelectedPart}
              disassemble={disassemble}
            />
          </Suspense>
        </Canvas>
        <div className={styles.disassembleContainer}>
          <div className={styles.sideTitle}>
            <p className={styles.disassembleTitle} onClick={handleModal}>
              제품명 타이틀
              <img src={dropdown} className={styles.icon} />
            </p>
            <img src={closeIcon} width={40} height={40} alt="closeIcon" />
          </div>
          {show && <div className={styles.modal}></div>}
          <div className={styles.disassembleImage}>
            <span className={styles.descriptionTitle}>제품 설명</span>
          </div>
          <div className={styles.disassembleDescription}>
            <div className={styles.topDescriptionInfoBox}>
              <span className={styles.descriptionInfo}>부품세부B</span>
              <span className={styles.descriptionInfoText}>
                부연설명부연설명부연설명부연설명부연설명부연설명부연설명부연설명부연설명부연설명부연설명부연설명부연설명부연설명부연설명부연설명부연설명부연설명부연설명부연설명부연설명부연설명부연설명부연설명부연설명부연설명부연설명부연설명부연설명부연설명
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.controlsContainer}>
        <aside className={styles.ai}>
          <p className={styles.aiTitle}>AI 어시스턴트</p>
          {aiValue.trim() !== "" && sendAi ? (
            <p className={styles.userSend}>{sendAi && aiValue}</p>
          ) : (
            <></>
          )}
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
              className={styles.icon}
              onClick={() => setSendAi(true)}
            />
          </div>
        </aside>
        <aside className={styles.memoContainer}>
          <div className={styles.memoHeader}>
            <p
              className={active === "memo" ? styles.noneTitle : styles.Title}
              onClick={() => setActive("memo")}
            >
              메모장
            </p>
            <p
              className={active === "all" ? styles.noneTitle : styles.Title}
              onClick={() => setActive("all")}
            >
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
                  <button className={styles.okay}>확인</button>
                </div>
              </div>
            ) : (
              <div className={styles.scrollX}>
                <div className={styles.memoWrapper}>
                  <p className={styles.memoSecondTitle}>V4_Engine</p>
                  <p className={styles.memoContent}>
                    메모메모메모메모메모메모메모메모메모메모메모메모메모메모메모메모메모메모메모
                  </p>
                  <p className={styles.day}>2026.02.05</p>
                </div>
                <div className={styles.memoWrapper}>
                  <p className={styles.memoSecondTitle}>V4_Engine</p>
                  <p className={styles.memoContent}>
                    메모메모메모메모메모메모메모메모메모메모메모메모메모메모메모메모메모메모메모
                  </p>
                  <p className={styles.day}>2026.02.05</p>
                </div>
                <div className={styles.memoWrapper}>
                  <p className={styles.memoSecondTitle}>V4_Engine</p>
                  <p className={styles.memoContent}>
                    메모메모메모메모메모메모메모메모메모메모메모메모메모메모메모메모메모메모메모
                  </p>
                  <p className={styles.day}>2026.02.05</p>
                </div>
                <div className={styles.memoWrapper}>
                  <p className={styles.memoSecondTitle}>V4_Engine</p>
                  <p className={styles.memoContent}>
                    메모메모메모메모메모메모메모메모메모메모메모메모메모메모메모메모메모메모메모
                  </p>
                  <p className={styles.day}>2026.02.05</p>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
