export function partNameToV4Key(partName: string) {
  if (!partName) return null;
  if (partName === "crankshaft") return "crankshaft";
  if (partName.startsWith("rod-") && !partName.startsWith("rodCap-"))
    return "connectingRod";
  if (partName.startsWith("rodCap-")) return "connectingRodCap";
  if (partName.startsWith("bolt-")) return "conrodBolt";
  if (partName.startsWith("pin-")) return "pistonPin";
  if (partName.startsWith("ring-")) return "pistonRing";
  if (partName.startsWith("piston-")) return "piston";
  return partName;
}
