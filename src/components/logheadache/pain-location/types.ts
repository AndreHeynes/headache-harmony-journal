
export interface HeadRegionSelectorProps {
  selectedRegion: string | null;
  setSelectedRegion: (region: string) => void;
  viewMode: "anterior" | "posterior";
  toggleView: () => void;
}

export interface DraggableRegion {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
}
