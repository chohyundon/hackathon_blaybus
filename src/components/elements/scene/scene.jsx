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
import { useAuthStore } from "../../../store/useAuthStore";
import { apiUrl } from "../../../api/config";

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
  const [aiData, setAiData] = useState([]);
  const [chatMessages, setChatMessages] = useState([]); // { id, role: "user"|"ai", type: "text"|"loading", text? }
  const chatBottomRef = useRef(null);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const parseJsonSafely = (value) => {
    if (typeof value !== "string") return null;
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  };

  // 서버가 prompt를 '"string"' 또는 '{"message":"..."}' 처럼 JSON 문자열로 저장하는 케이스 정규화
  const normalizePromptText = (prompt) => {
    if (typeof prompt !== "string") return "";
    const parsed = parseJsonSafely(prompt);
    if (typeof parsed === "string") return parsed;
    if (parsed && typeof parsed === "object" && "message" in parsed) {
      return String(parsed.message ?? "");
    }
    return prompt;
  };

  // response가 그냥 텍스트이거나, '{"message":"..."}' 같이 JSON 문자열인 케이스 모두 처리
  const normalizeResponseText = (response) => {
    if (typeof response !== "string") return "";
    const parsed = parseJsonSafely(response);
    if (typeof parsed === "string") return parsed;
    if (parsed && typeof parsed === "object" && "message" in parsed) {
      return String(parsed.message ?? "");
    }
    return response;
  };

  // API 대화 목록 [{ prompt, response, id, timestamp }, ...] → 채팅 메시지 배열로 변환 (prompt=유저, response=AI)
  const conversationsToChatMessages = (list) => {
    const arr = Array.isArray(list) ? list : [];
    const out = [];
    arr.forEach((item) => {
      const userText = normalizePromptText(item.prompt);
      const aiText = normalizeResponseText(item.response);
      const idBase = item.id ?? out.length;
      out.push({
        id: `${idBase}-u`,
        role: "user",
        type: "text",
        text: userText,
      });
      out.push({ id: `${idBase}-a`, role: "ai", type: "text", text: aiText });
    });
    return out;
  };

  // 채팅이 추가될 때 항상 맨 아래로 스크롤
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ block: "end" });
  }, [chatMessages.length]);

  // 진입 시 기존 대화 목록 로드 (API: prompt=유저 메시지, response=AI 메시지)
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const res = await fetch(apiUrl("/conversations"), {
          credentials: "include",
        });
        if (!res.ok) return;
        const contentType = res.headers.get("content-type");
        if (!contentType?.includes("application/json")) return;
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : data?.data ?? data?.conversations ?? [];
        setChatMessages(conversationsToChatMessages(list));
        setAiData(list);
      } catch (e) {
        console.warn("loadConversations failed", e);
      }
    };
    loadConversations();
  }, []);

  // Scene에서도 사용자 정보 로드 (직접 /scene 진입 시 스토어에 user가 없을 수 있음)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const tokenRes = await fetch(apiUrl("/auth/token"), {
          credentials: "include",
          method: "POST",
        });
        const contentType = tokenRes.headers.get("content-type");
        if (!tokenRes.ok || !contentType?.includes("application/json")) {
          setUser(null);
          return;
        }
        const data = await tokenRes.json();
        if (data?.accessToken) {
          const meRes = await fetch(apiUrl("/users/me"), {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.accessToken}`,
            },
            method: "GET",
          });
          if (
            !meRes.ok ||
            !meRes.headers.get("content-type")?.includes("application/json")
          ) {
            setUser(null);
            return;
          }
          const userData = await meRes.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.warn("fetchUser failed", e);
        setUser(null);
      }
    };
    fetchUser();
  }, [setUser]);

  console.log(user);

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

  const handleGetMemos = async () => {
    setActive("memo");
    if (!user?.userId) return;
    const bodyData = {
      userId: user.userId,
      title: selectedObject,
      body: textValue,
    };
    await fetch(apiUrl("/memonote"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });
  };

  const handleGetAllMemos = async () => {
    setActive("all");
    if (!user?.userId) return;
    const memos = await fetch(apiUrl(`/memonote/${user.userId}`), {
      credentials: "include",
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (memos.status === 401) {
      setUser(null);
      return;
    }
    const contentType = memos.headers.get("content-type");
    if (!memos.ok || !contentType?.includes("application/json")) return;
    const memoData = await memos.json();
    const list = Array.isArray(memoData)
      ? memoData
      : memoData?.data ?? memoData?.memos ?? [];
    setMemos(
      list.map((m) => ({
        object: m.object ?? m.title ?? "",
        text: m.text ?? m.body ?? "",
        date: m.date ?? m.createdAt ?? "",
      }))
    );
  };

  console.log(memoStore);

  const handleSubmitAi = async (e) => {
    e.preventDefault();
    const prompt = aiValue.trim();
    if (!prompt) return;
    const userMsgId = `${Date.now()}-u`;
    const aiLoadingId = `${Date.now()}-a`;
    setChatMessages((prev) => [
      ...prev,
      { id: userMsgId, role: "user", type: "text", text: prompt },
      { id: aiLoadingId, role: "ai", type: "loading" },
    ]);
    setAiValue("");
    const bodyData = { message: prompt };
    try {
      const res = await fetch(apiUrl("/chat"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) throw new Error("chat request failed");

      const getAiData = await fetch(apiUrl("/conversations"), {
        credentials: "include",
      });
      const data = await getAiData.json();
      const list = Array.isArray(data)
        ? data
        : data?.data ?? data?.conversations ?? [];
      setAiData(list);
      // API 목록(prompt=유저, response=AI)으로 채팅 전체 갱신
      setChatMessages(conversationsToChatMessages(list));
    } catch (err) {
      console.warn("handleSubmitAi failed", err);
      // 실패 시에도 loading을 에러 메시지로 교체
      setChatMessages((prev) => {
        const next = [...prev];
        for (let i = next.length - 1; i >= 0; i -= 1) {
          if (next[i]?.role === "ai" && next[i]?.type === "loading") {
            next[i] = {
              ...next[i],
              type: "text",
              text: "응답을 가져오지 못했어요. 잠시 후 다시 시도해 주세요.",
            };
            return next;
          }
        }
        return next;
      });
    }
  };

  console.log(chatMessages);

  return (
    <main className={styles.mainContainer}>
      <Header
        showService={showService}
        setShowService={setShowService}
        selectedObject={selectedObject}
        setSelectedObject={setSelectedObject}
      />
      <div className={styles.sceneContainer}>
        {zoomIn ? (
          <Zoom
            setZoomIn={setZoomIn}
            selectedObject={selectedObject}
            selectedPart={selectedPart}
            setSelectedPart={setSelectedPart}
            disassemble={disassemble}
            setDisassemble={setDisassemble}
          />
        ) : (
          <>
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
                onOpenZoom={() => setZoomIn(true)}
              />
            </div>
          </>
        )}
      </div>
      <div className={styles.controlsContainer}>
        <aside className={styles.ai}>
          <p className={styles.aiTitle}>AI 어시스턴트</p>
          <div className={styles.aiInputText}>
            {chatMessages.map((m) =>
              m.type === "loading" ? (
                <div key={m.id} className={styles.noneAiText}>
                  <span className={styles.circle1}></span>
                  <span className={styles.circle2}></span>
                  <span className={styles.circle3}></span>
                </div>
              ) : m.role === "user" ? (
                <div key={m.id} className={styles.userSend}>
                  {m.text}
                </div>
              ) : (
                <div key={m.id} className={styles.aiText}>
                  {m.text}
                </div>
              )
            )}
            <div ref={chatBottomRef} />
          </div>
          <form onSubmit={handleSubmitAi}>
            <div className={styles.inputContainer}>
              <input
                id="input"
                placeholder="무엇이 궁금하신가요?"
                className={styles.input}
                value={aiValue}
                onChange={(e) => handleAiValue(e)}
              />
              <button
                type="submit"
                className={styles.arrowButton}
                aria-label="전송">
                <img
                  src={icon_arrow}
                  width={24}
                  height={24}
                  className={styles.arrowIcon}
                  alt=""
                />
              </button>
            </div>
          </form>
        </aside>
        <aside className={styles.memoContainer}>
          <div className={styles.memoHeader}>
            <p
              className={`${styles.tab} ${
                active === "memo" ? styles.tabActive : styles.tabInactive
              }`}
              onClick={handleGetMemos}>
              메모장
            </p>

            <p
              className={`${styles.tab} ${
                active === "all" ? styles.tabActive : styles.tabInactive
              }`}
              onClick={handleGetAllMemos}>
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
    </main>
  );
}
