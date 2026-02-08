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
  "beaterDisc",
  "gearing",
  "impellarBlade",
  "leg",
  "leg2",
  "leg3",
  "leg4",
  "mainFrame",
  "mainFrameMir",
  "nut",
  "screw",
  "xyz",
];

const DEG90 = (Math.PI / 180) * 90;
const DEG180 = (Math.PI / 180) * 180;

// 레그 4개: 프레임 중심 기준 앞·뒤·좌·우 (XZ 평면)
const DRONE_POSITIONS = [
  [10, 0, 0], // armGear
  [10, 0.082, 0], // beaterDisc
  [20, 0.24, 0.15], // gearing
  [30, 0.55, -0.126], // impellarBlade
  [0.05, 0, 0.05], // leg (앞-오른쪽)
  [-0.12, 0, 0.12], // leg2 (앞-왼쪽)
  [-0.12, 0, -0.12], // leg3 (뒤-왼쪽)
  [0.12, 0, -0.12], // leg4 (뒤-오른쪽)
  [0, 0, -0.1], // mainFrame
  [0, 0, -0.1], // mainFrameMir
  [70, 0.6, 0.45], // nut
  [80, 0.6, 0.45], // screw
  [90, 0.5, 0], // xyz
];

const DRONE_ROTATIONS = [
  [0, 0, 0], // armGear
  [0, 0, 0], // beaterDisc
  [0, 0, 0], // gearing
  [0, 0, 0], // impellarBlade
  [0, 0, 0], // leg
  [0, DEG90, 0], // leg2
  [0, DEG180, 0], // leg3
  [0, DEG90 * 3, 0], // leg4 (270°)
  [1.6, DEG180, 0], // mainFrame
  [1.6, DEG180, 0], // mainFrameMir
  [0, 0, 0], // nut
  [0, 0, 0], // screw
  [0, 0, 0], // xyz
];

const DISASSEMBLE_OFFSETS = [
  [0, 0, 0],
  [0, 0.08, 0],
  [0, 0.1, 0.02],
  [0, 0.1, 0.04],
  [0, 0.08, 0.06],
  [0, 0.08, 0.06],
  [0, 0.08, 0.06],
  [0, 0.08, 0.06],
  [0.06, 0.06, 0.08],
  [0.08, 0.04, 0.1],
  [0.1, 0.02, 0.12],
  [0.1, 0.02, 0.12],
  [0.1, 0.02, 0.12],
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
    beaterDisc,
    gearing,
    impellarBlade,
    leg,
    leg,
    leg,
    leg,
    mainFrame,
    mainFrameMir,
    nut,
    screw,
    xyz,
  ];
  const clones = useMemo(() => {
    const list = scenes.map((gltf) => gltf.scene.clone());
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
        />
      ))}
    </group>
  );
}
