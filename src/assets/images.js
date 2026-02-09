import crankshaft from "./v4/Crankshaft.svg";
import connectingRod from "./v4/ConnectingRod.svg";
import connectingRodCap from "./v4/ConnectingRodCap.svg";
import conrodBolt from "./v4/ConrodBolt.svg";
import pistonPin from "./v4/PistonPin.svg";
import piston from "./v4/Piston.svg";
import pistonRing from "./v4/PistonRing.svg";
import v4Engine from "./v4/v4Engine.svg";

import droneSvg from "./drone/drone.svg";
import armGear from "./drone/ArmGear.svg";
import beaterDisc from "./drone/BeaterDisc.svg";
import gearing from "./drone/Gearing.svg";
import impellarBlade from "./drone/ImpellarBlade.svg";
import leg from "./drone/Leg.svg";
import mainFrameMir from "./drone/Main frame_MIR.svg";
import mainFrame from "./drone/MainFrame.svg";
import nut from "./drone/Nut.svg";
import screw from "./drone/Screw.svg";
import xyz from "./drone/xyz.svg";

import robotArm from "./robotArm/RobotArm.svg";
import waistLing from "./robotArm/RobotCrankshaft.svg";
import base from "./robotArm/Connectingrod.svg";
import gripperFrame from "./robotArm/Connectingrod-1.svg";
import gripperFinger from "./robotArm/ConnectingRodCap.svg";
import lowerArm from "./robotArm/RobotConrodBolt.svg";
import wristLink from "./robotArm/PistonPin.svg";
import wristJoint from "./robotArm/RoboPiston.svg";
import upperArm from "./robotArm/RobotPistonRing.svg";

import suspension from "./suspension/suspension.svg";
import suspensionRod from "./suspension/ConnectingRodCap.svg";
import suspensionBase from "./suspension/ConrodBolt.svg";
import suspensionSpring from "./suspension/Crankshaft.svg";
import SuspensionNut from "./suspension/Piston.svg";

export const v4Images = [
  v4Engine,
  crankshaft,
  connectingRod,
  connectingRodCap,
  conrodBolt,
  pistonPin,
  piston,
  pistonRing,
];

export const droneImages = [
  droneSvg,
  armGear,
  beaterDisc,
  gearing,
  impellarBlade,
  leg,
  mainFrameMir,
  mainFrame,
  nut,
  screw,
  xyz,
];

// 로봇팔 구조 순서 (베이스→그리퍼)
export const robotArmImages = [
  robotArm,
  base,
  waistLing,
  lowerArm,
  upperArm,
  wristJoint,
  wristLink,
  gripperFrame,
  gripperFinger,
];

export const suspensionImages = [
  suspension,
  suspensionBase,
  SuspensionNut,
  suspensionRod,
  suspensionSpring,
];
