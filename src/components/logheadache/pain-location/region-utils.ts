
import { DraggableRegion } from "./types";

export const anteriorRegionsData: DraggableRegion[] = [
  { id: "forehead", x: 140, y: 100, width: 80, height: 30, name: "Forehead" },
  { id: "temple-left", x: 295, y: 140, width: 60, height: 30, name: "Left Temple" },
  { id: "temple-right", x: 25, y: 140, width: 60, height: 30, name: "Right Temple" },
  { id: "eyes-left", x: 190, y: 170, width: 55, height: 30, name: "Left Eye" },
  { id: "eyes-right", x: 105, y: 170, width: 55, height: 30, name: "Right Eye" },
  { id: "upper-sinuses", x: 140, y: 210, width: 80, height: 30, name: "Upper Sinuses" },
  { id: "lower-sinuses", x: 140, y: 250, width: 80, height: 30, name: "Lower Sinuses" },
];

export const posteriorRegionsData: DraggableRegion[] = [
  { id: "top-head", x: 110, y: 90, width: 80, height: 30, name: "Top of head" },
  { id: "bump-head", x: 110, y: 160, width: 80, height: 30, name: "Bump of head" },
  { id: "base-head", x: 110, y: 230, width: 80, height: 30, name: "Base of head" },
];

export const getRegionDisplayName = (regionId: string): string => {
  const nameMap: Record<string, string> = {
    "forehead": "Forehead",
    "upper-sinuses": "Upper Sinuses",
    "lower-sinuses": "Lower Sinuses",
    "eyes-left": "Left Eye",
    "eyes-right": "Right Eye",
    "temple-left": "Left Temple",
    "temple-right": "Right Temple",
    "top-head": "Top of head",
    "bump-head": "Bump of head",
    "base-head": "Base of head"
  };
  return nameMap[regionId] || regionId.replace(/-/g, ' ');
};
