import styles from "./scene.module.css";
import dropdown from "../../../assets/dropdown.png";
import closeIcon from "../../../assets/closeIcon.svg";
import checkIcon from "../../../assets/check.svg";
import {
  v4Images,
  droneImages,
  robotArmImages,
  suspensionImages,
} from "../../../assets/images";
import { useState, useEffect } from "react";
import { v4 } from "../../mock/v4";
import { robotArm as robotArmMock } from "../../mock/robotArm";
import { drone as droneMock } from "../../mock/droneDescription";
import { v4 as suspensionMock } from "../../mock/suspension";

const toV4PartId = (title) => {
  const map = {
    crankshaft: "crankshaft",
    connectingRod: "rod-0",
    connectingRodCap: "cap-0",
    conrodBolt: "bolt-0",
    pistonPin: "pin-0",
    piston: "piston-0",
    pistonRing: "ring-0",
  };
  return map[title] ?? title;
};

// robotArm.jsx PART_IDS와 매칭: base→robot-base, waist→part2, lowerArm→part3, ...
const toRobotArmPartId = (title) => {
  const map = {
    robotArm: null,
    base: "robot-base",
    waist: "robot-part2",
    lowerArm: "robot-part3",
    upperArm: "robot-part4",
    wristJoint: "robot-part5",
    wristLink: "robot-part6",
    gripperFrame: "robot-part7",
    gripperFinger: "robot-part8",
  };
  return map[title] ?? (title ? `robot-${title}` : null);
};

// 3D 클릭 시 selectedPart.id → mock/설명용 id 역변환 (robot-base→base, robot-part2→waist 등)
const fromRobotArmPartId = (id) => {
  const map = {
    "robot-base": "base",
    "robot-part2": "waist",
    "robot-part3": "lowerArm",
    "robot-part4": "upperArm",
    "robot-part5": "wristJoint",
    "robot-part6": "wristLink",
    "robot-part7": "gripperFrame",
    "robot-part8": "gripperFinger",
    "robot-part9": "gripperFinger",
  };
  return map[id];
};

const toDronePartId = (title) => {
  const map = {
    drone: "drone",
    armGear: "robot-armGear",
    beaterDisc: "robot-beaterDisc",
    gearing: "robot-gearing",
    impellarBlade: "robot-impellarBlade",
    leg: "robot-leg",
    mainFrameMir: "robot-mainFrameMir",
    mainFrame: "robot-mainFrame",
    nut: "robot-nut",
    screw: "robot-screw",
    xyz: "robot-xyz",
  };
  return map[title] ?? `robot-${title}`;
};

// 3D 클릭 시 selectedPart.id → mock/설명용 id 역변환 (robot-armGear→armGear, robot-armGear2→armGear 등)
const fromDronePartId = (id) => {
  if (id === "drone") return "drone";
  if (!id?.startsWith("robot-")) return undefined;
  const rest = id.slice(6);
  const base = rest.replace(/\d+$/, ""); // armGear2 → armGear
  const valid = [
    "armGear",
    "beaterDisc",
    "gearing",
    "impellarBlade",
    "leg",
    "mainFrameMir",
    "mainFrame",
    "nut",
    "screw",
    "xyz",
  ];
  return valid.includes(base) ? base : undefined;
};

// suspension.jsx PART_IDS: base, nut, rod, spring
const toSuspensionPartId = (title) => {
  const map = {
    suspension: null,
    base: "suspension-base",
    Nut: "suspension-nut",
    Rod: "suspension-rod",
    Spring: "suspension-spring",
  };
  return map[title] ?? (title ? `suspension-${title}` : null);
};

// 3D 클릭 시 selectedPart.id → mock id 역변환
const fromSuspensionPartId = (id) => {
  const map = {
    "suspension-base": "base",
    "suspension-nut": "Nut",
    "suspension-rod": "Rod",
    "suspension-spring": "Spring",
  };
  return map[id];
};

export default function SideScene({
  selectedPart,
  selectedObject,
  setSelectedPart,
  onOpenZoom,
}) {
  const [show, setShow] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("crankshaft");

  const title = ["v4Engine", "robotArm", "drone", "suspension"];

  const handleModal = () => {
    setShow((prev) => !prev);
  };

  const v4Description = [
    "v4Engine",
    "crankshaft",
    "connectingRod",
    "connectingRodCap",
    "conrodBolt",
    "pistonPin",
    "piston",
    "pistonRing",
  ];

  // mock id와 일치 (Nut, Rod, Spring 대문자)
  const suspensionDescription = ["suspension", "base", "Nut", "Rod", "Spring"];

  // 이미지 순서와 3D 부품 1:1 매칭 (robotArmImages와 동일 순서)
  const robotArmDescription = [
    "robotArm",
    "base",
    "waist",
    "lowerArm",
    "upperArm",
    "wristJoint",
    "wristLink",
    "gripperFrame",
    "gripperFinger",
  ];

  const droneDescription = [
    "drone",
    "armGear",
    "beaterDisc",
    "gearing",
    "impellarBlade",
    "leg",
    "mainFrameMir",
    "mainFrame",
    "nut",
    "screw",
    "xyz",
  ];

  const idMapping = {
    suspension: "suspension",
    Nut: "Nut",
    Rod: "Rod",
    Spring: "Spring",
    robotArm: "robotArm",
    base: "base",
    waist: "waist",
    lowerArm: "lowerArm",
    upperArm: "upperArm",
    wristJoint: "wristJoint",
    wristLink: "wristLink",
    gripperFrame: "gripperFrame",
    gripperFinger: "gripperFinger",
    pin: "pistonPin",
    rod: "connectingRod",
    ring: "pistonRing",
    bolt: "conrodBolt",
    cap: "connectingRodCap",
    crankshaft: "crankshaft",
    piston: "piston",
    armGear: "armGear",
    beaterDisc: "beaterDisc",
    gearing: "gearing",
    impellarBlade: "impellarBlade",
    leg: "leg",
    mainFrameMir: "mainFrameMir",
    mainFrame: "mainFrame",
    nut: "nut",
    screw: "screw",
    xyz: "xyz",
  };

  const formatData = selectedPart?.id
    ? (() => {
        // 로봇팔 3D id (robot-base, robot-part2 등) → mock id (base, waist 등)
        const robotDescId = fromRobotArmPartId(selectedPart.id);
        if (robotDescId) return robotDescId;
        // 드론 3D id (robot-armGear, robot-armGear2 등) → mock id (armGear 등)
        const droneDescId = fromDronePartId(selectedPart.id);
        if (droneDescId) return droneDescId;
        // 서스펜션 3D id → mock id
        const suspensionDescId = fromSuspensionPartId(selectedPart.id);
        if (suspensionDescId) return suspensionDescId;
        const baseId = selectedPart.id
          .split("-")
          .filter((part) => !/^\d+$/.test(part))[0];
        return idMapping[baseId] ?? baseId;
      })()
    : null;

  const currentDescriptions =
    selectedObject === "Drone"
      ? droneDescription
      : selectedObject === "Robot Arm"
      ? robotArmDescription
      : selectedObject === "Suspension"
      ? suspensionDescription
      : v4Description;
  const currentImages =
    selectedObject === "Drone"
      ? droneImages
      : selectedObject === "Robot Arm"
      ? robotArmImages
      : selectedObject === "Suspension"
      ? suspensionImages
      : v4Images;
  const getPartData = (id) => {
    const mock =
      selectedObject === "Drone"
        ? droneMock
        : selectedObject === "Robot Arm"
        ? robotArmMock
        : selectedObject === "Suspension"
        ? suspensionMock
        : v4;
    return (
      mock.mockSelectedPart.find((part) => part.id === id) ??
      v4.mockSelectedPart.find((part) => part.id === id)
    );
  };

  useEffect(() => {
    const descriptions =
      selectedObject === "Drone"
        ? droneDescription
        : selectedObject === "Robot Arm"
        ? robotArmDescription
        : selectedObject === "Suspension"
        ? suspensionDescription
        : v4Description;
    if (formatData && descriptions.includes(formatData)) {
      setSelectedTitle(formatData);
    }
  }, [formatData, selectedObject]);

  useEffect(() => {
    const descriptions =
      selectedObject === "Drone"
        ? droneDescription
        : selectedObject === "Robot Arm"
        ? robotArmDescription
        : selectedObject === "Suspension"
        ? suspensionDescription
        : v4Description;
    setSelectedTitle((prev) =>
      descriptions.includes(prev) ? prev : descriptions[0]
    );
  }, [selectedObject]);

  return (
    <aside className={styles.disassembleContainer}>
      <div className={styles.sideTitle}>
        <p className={styles.disassembleTitle} onClick={handleModal}>
          {selectedObject}
          <img src={dropdown} className={styles.icon} />
        </p>
        <img
          className={styles.closeIcon}
          src={closeIcon}
          width={40}
          height={40}
          alt="closeIcon"
          onClick={() => {
            if (onOpenZoom) onOpenZoom();
            setShow(false);
          }}
        />
      </div>
      {show && (
        <div className={styles.modal}>
          {currentDescriptions.map((title, index) => (
            <div
              key={index}
              onClick={() => {
                setSelectedTitle(title);
                setShow(false);
                if (setSelectedPart && index > 0) {
                  const partId =
                    selectedObject === "Drone"
                      ? toDronePartId(title)
                      : selectedObject === "Robot Arm"
                      ? toRobotArmPartId(title)
                      : selectedObject === "Suspension"
                      ? toSuspensionPartId(title)
                      : toV4PartId(title);
                  if (partId) {
                    setSelectedPart({
                      id: partId,
                      worldPos: null,
                      intent: "FOCUS_CAMERA",
                    });
                  } else {
                    setSelectedPart(null);
                  }
                } else if (setSelectedPart && index === 0) {
                  setSelectedPart(null);
                }
              }}>
              <p
                className={
                  selectedTitle === title
                    ? styles.modalTitleTextActive
                    : styles.modalTitleText
                }>
                {getPartData(title)?.name ?? title}
                {selectedTitle === title && (
                  <img
                    src={checkIcon}
                    width={20}
                    height={20}
                    alt="checkIcon"
                    className={styles.checkIcon}
                  />
                )}
              </p>
            </div>
          ))}
        </div>
      )}
      <div className={styles.disassembleImage}>
        {currentImages.map((image, index) => (
          <div
            className={
              selectedTitle === currentDescriptions[index]
                ? styles.descriptionTitleActive
                : styles.descriptionTitle
            }
            onClick={() => {
              const title = currentDescriptions[index];
              setSelectedTitle(title);
              if (setSelectedPart && index > 0) {
                const partId =
                  selectedObject === "Drone"
                    ? toDronePartId(title)
                    : selectedObject === "Robot Arm"
                    ? toRobotArmPartId(title)
                    : selectedObject === "Suspension"
                    ? toSuspensionPartId(title)
                    : toV4PartId(title);
                if (partId) {
                  setSelectedPart({
                    id: partId,
                    worldPos: null,
                    intent: "FOCUS_CAMERA",
                  });
                } else {
                  setSelectedPart(null);
                }
              } else if (setSelectedPart && index === 0) {
                setSelectedPart(null);
              }
            }}
            key={index}>
            <img
              src={image}
              alt={
                getPartData(currentDescriptions[index])?.name ??
                currentDescriptions[index]
              }
              width={80}
              height={80}
              className={styles.descriptionImage}
            />
          </div>
        ))}
      </div>
      <div className={styles.disassembleDescription}>
        <div className={styles.topDescriptionInfoBox}>
          <span className={styles.descriptionInfo}>
            {title.includes(selectedTitle) ? "핵심설명" : "이름"}
          </span>
          <span className={styles.descriptionInfoText}>
            {title.includes(selectedTitle)
              ? getPartData(selectedTitle)?.core
              : getPartData(selectedTitle)?.name}
          </span>
        </div>
        <div className={styles.topDescriptionInfoBox}>
          <span className={styles.descriptionInfo}>
            {title.includes(selectedTitle) ? "용도" : "역할"}
          </span>
          <span className={styles.descriptionInfoText}>
            {getPartData(selectedTitle)?.usage}
          </span>
        </div>
        <div className={styles.topDescriptionInfoBox}>
          <span className={styles.descriptionInfo}>
            {title.includes(selectedTitle) ? "작동원리" : "소재"}
          </span>
          <span className={styles.descriptionInfoText}>
            {title.includes(selectedTitle)
              ? getPartData(selectedTitle)?.principle
              : getPartData(selectedTitle)?.material}
          </span>
        </div>
      </div>
    </aside>
  );
}
