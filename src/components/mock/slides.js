import V4Engine from "../../assets/V4.svg";
import Drone from "../../assets/Drone.svg";
import Suspension from "../../assets/Suspension.svg";
import RobotArm from "../../assets/RobotArm.svg";

import Crankshaft from "../../assets/v4/crankshaft.svg";
import ConnectingRod from "../../assets/v4/connectingRod.svg";
import ConnectingRodCap from "../../assets/v4/connectingRodCap.svg";
import ConrodBolt from "../../assets/v4/conrodBolt.svg";
import PistonPin from "../../assets/v4/pistonPin.svg";
import Piston from "../../assets/v4/piston.svg";
import PistonRing from "../../assets/v4/pistonRing.svg";

import armGear from "../../assets/drone/ArmGear.svg";
import beaterDisc from "../../assets/drone/BeaterDisc.svg";
import gearing from "../../assets/drone/Gearing.svg";
import impellarBlade from "../../assets/drone/ImpellarBlade.svg";
import leg from "../../assets/drone/Leg.svg";
import mainFrameMir from "../../assets/drone/Main frame_MIR.svg";
import mainFrame from "../../assets/drone/MainFrame.svg";
import nut from "../../assets/drone/Nut.svg";

import robotArm from "../../assets/robotArm/RobotArm.svg";
import robotCrankshaft from "../../assets/robotArm/RobotCrankshaft.svg";
import connectingrod from "../../assets/robotArm/Connectingrod.svg";
import connectingrod1 from "../../assets/robotArm/Connectingrod-1.svg";
import connectingrodcap from "../../assets/robotArm/ConnectingRodCap.svg";
import robotconrodbolt from "../../assets/robotArm/RobotConrodBolt.svg";
import pistonpin from "../../assets/robotArm/PistonPin.svg";
import robotpiston from "../../assets/robotArm/RoboPiston.svg";
import robotpistonring from "../../assets/robotArm/RobotPistonRing.svg";

import suspension from "../../assets/suspension/suspension.svg";
import suspensionRod from "../../assets/suspension/ConnectingRodCap.svg";
import suspensionBase from "../../assets/suspension/ConrodBolt.svg";
import suspensionSpring from "../../assets/suspension/Crankshaft.svg";
import SuspensionNut from "../../assets/suspension/piston.svg";

export const suspensionImages = [
  suspension,
  suspensionBase,
  SuspensionNut,
  suspensionRod,
  suspensionSpring,
];

export const droneImages = [
  armGear,
  beaterDisc,
  gearing,
  impellarBlade,
  leg,
  mainFrameMir,
  mainFrame,
  nut,
];

export const robotArmImages = [
  robotArm,
  robotCrankshaft,
  connectingrod,
  connectingrod1,
  connectingrodcap,
  robotconrodbolt,
  pistonpin,
  robotpiston,
  robotpistonring,
];

export const v4Images = [
  Crankshaft,
  ConnectingRod,
  ConnectingRodCap,
  ConrodBolt,
  PistonPin,
  Piston,
  PistonRing,
];

export const slides = [
  {
    image: V4Engine,
    name: "V4_Engine",
    description: `실린더 4개가 V자 형태 두 줄로 배치되고 
    모두 하나의 크랭크축에 연결된 피스톤 엔진`,
  },
  {
    image: Drone,
    name: "Drone",
    description: `4개의 프로펠러와 전면의 비터 디스크를 
    갖춘 쿼드콥터 형태의 비행체`,
  },
  {
    image: Suspension,
    name: "Suspension",
    description: `강재.알루미늄 구조물 위에 스프링강으로 
    만든 스프링과 너트가 결합된 구조`,
  },
  {
    image: RobotArm,
    name: "Robot Arm",
    description: `고정된 베이스에 여러 개의 링크와 회전 관절이 
    직렬로 연결된 다관절 매니퓰레이터`,
  },
];
