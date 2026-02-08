import React, { useMemo } from "react";
import { useGLTF } from "@react-three/drei";

import armGearUrl from "../../../assets/3DAsset/Drone/Arm gear.glb?url";
import beaterDiscUrl from "../../../assets/3DAsset/Drone/Beater disc.glb?url";
import gearingUrl from "../../../assets/3DAsset/Drone/Gearing.glb?url";
import impellarBladeUrl from "../../../assets/3DAsset/Drone/Impellar Blade.glb?url";
import legUrl from "../../../assets/3DAsset/Drone/Leg.glb?url";
import mainFrameUrl from "../../../assets/3DAsset/Drone/Main frame.glb?url";
import mainFrameMirUrl from "../../../assets/3DAsset/Drone/Main frame_MIR.glb?url";
import nutUrl from "../../../assets/3DAsset/Drone/Nut.glb?url";
import screwUrl from "../../../assets/3DAsset/Drone/Screw.glb?url";
import xyzUrl from "../../../assets/3DAsset/Drone/xyz.glb?url";
import RenderItem from "../Render/render";
import {
  ARM_GEAR,
  BEATER_DISC,
  GEARING,
  IMPELLAR_BLADE,
  LEG, // 테스트용 임시 제외
  MAIN_FRAME,
  MAIN_FRAME_MIR,
  NUT,
  SCREW,
  XYZ,
} from "../../mock/drone";

const URLS = {
  armGear: armGearUrl,
  beaterDisc: beaterDiscUrl,
  gearing: gearingUrl,
  impellarBlade: impellarBladeUrl,
  leg: legUrl,
  mainFrame: mainFrameUrl,
  mainFrameMir: mainFrameMirUrl,
  nut: nutUrl,
  screw: screwUrl,
  xyz: xyzUrl,
};

const DRONE_PART_IDS = [
  "armGear",
  "armGear2",
  "armGear3",
  "armGear4",
  "beaterDisc",
  "gearing",
  "gearing2",
  "gearing3",
  "gearing4",
  "impellarBlade",
  "impellarBlade2",
  "impellarBlade3",
  "impellarBlade4",
  "leg",
  "leg2",
  "leg3",
  "leg4", // 테스트용 임시 제외
  "mainFrame",
  "mainFrameMir",
  "nut",
  "nut2",
  "nut3",
  "nut4",
  "screw",
  "screw2",
  "screw3",
  "screw4",
  "xyz",
  "xyz2",
  "xyz3",
  "xyz4",
];

/** 드론 부품 클릭 시 하이라이트 색 (hex) */
const DRONE_SELECTED_COLOR = "#ffffff";
/** 드론 부품 선택 시 전진 오프셋 [x, y, z] */
const DRONE_SELECTED_OFFSET = [0, 0.1, 0.05];

// ——— 합치기 ———
const DRONE_POSITIONS = [
  ...ARM_GEAR.positions,
  BEATER_DISC.position,
  ...GEARING.positions,
  ...IMPELLAR_BLADE.positions,
  ...LEG.positions,
  MAIN_FRAME.position,
  MAIN_FRAME_MIR.position,
  ...NUT.positions,
  ...SCREW.positions,
  ...XYZ.positions,
];
const DRONE_ROTATIONS = [
  ...ARM_GEAR.rotations,
  BEATER_DISC.rotation,
  ...GEARING.rotations,
  ...IMPELLAR_BLADE.rotations,
  ...LEG.rotations,
  MAIN_FRAME.rotation,
  MAIN_FRAME_MIR.rotation,
  ...NUT.rotations,
  ...SCREW.rotations,
  ...XYZ.rotations,
];
const DISASSEMBLE_OFFSETS = [
  ...ARM_GEAR.offsets,
  BEATER_DISC.offset,
  ...GEARING.offsets,
  ...IMPELLAR_BLADE.offsets,
  ...LEG.offsets,
  MAIN_FRAME.offset,
  MAIN_FRAME_MIR.offset,
  ...NUT.offsets,
  ...SCREW.offsets,
  ...XYZ.offsets,
];

export default function Drone({
  selectedPart,
  setSelectedPart,
  disassemble = 0,
}) {
  const armGear = useGLTF(URLS.armGear);
  const beaterDisc = useGLTF(URLS.beaterDisc);
  const gearing = useGLTF(URLS.gearing);
  const impellarBlade = useGLTF(URLS.impellarBlade);
  const leg = useGLTF(URLS.leg);
  const mainFrame = useGLTF(URLS.mainFrame);
  const mainFrameMir = useGLTF(URLS.mainFrameMir);
  const nut = useGLTF(URLS.nut);
  const screw = useGLTF(URLS.screw);
  const xyz = useGLTF(URLS.xyz);

  const scenes = [
    armGear,
    armGear,
    armGear,
    armGear,
    beaterDisc,
    gearing,
    gearing,
    gearing,
    gearing,
    impellarBlade,
    impellarBlade,
    impellarBlade,
    impellarBlade,
    leg,
    leg,
    leg,
    leg, // 테스트용 임시 제외
    mainFrame,
    mainFrameMir,
    nut,
    nut,
    nut,
    nut,
    screw,
    screw,
    screw,
    screw,
    xyz,
    xyz,
    xyz,
    xyz,
  ];
  const clones = useMemo(() => {
    const list = scenes.map((gltf) => {
      const clone = gltf.scene.clone();
      // 부품별로 재질 복제 → 선택 시 해당 부품만 색상 변경 (공유 재질 방지)
      clone.traverse((child) => {
        if (child.isMesh && child.material) {
          const mats = Array.isArray(child.material)
            ? child.material
            : [child.material];
          child.material = Array.isArray(child.material)
            ? mats.map((m) => m.clone())
            : child.material.clone();
        }
      });
      return clone;
    });
    return list;
  }, [
    armGear,
    beaterDisc,
    gearing,
    impellarBlade,
    leg,
    mainFrame,
    mainFrameMir,
    nut,
    screw,
    xyz,
  ]);

  return (
    <group>
      {DRONE_PART_IDS.map((id, index) => (
        <RenderItem
          key={id}
          object={clones[index]}
          basePosition={DRONE_POSITIONS[index]}
          rotation={DRONE_ROTATIONS[index]}
          id={`robot-${id}`}
          selectedPart={selectedPart}
          setSelectedPart={setSelectedPart}
          disassemble={disassemble}
          disassembleOffset={DISASSEMBLE_OFFSETS[index]}
          focusPosition={null}
          baseColor={null}
          focusColor={DRONE_SELECTED_COLOR}
          selectedOffset={DRONE_SELECTED_OFFSET}
        />
      ))}
    </group>
  );
}
