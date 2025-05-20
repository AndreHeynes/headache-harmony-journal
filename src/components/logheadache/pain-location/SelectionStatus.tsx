
import { getRegionDisplayName } from "./region-utils";

interface SelectionStatusProps {
  selectedRegion: string | null;
  activeRegion: string | null;
}

export function SelectionStatus({ selectedRegion, activeRegion }: SelectionStatusProps) {
  if (!selectedRegion && !activeRegion) return null;

  return (
    <>
      {selectedRegion && (
        <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-md">
          <p className="text-white">
            Selected: <span className="font-medium text-primary">
              {getRegionDisplayName(selectedRegion)}
            </span>
          </p>
        </div>
      )}

      {activeRegion && (
        <div className="mt-2 p-2 bg-cyan-500/20 border border-cyan-500/50 rounded-md">
          <p className="text-sm text-white">
            <span className="font-medium">Drag Mode:</span> Click to place "{getRegionDisplayName(activeRegion)}"
          </p>
        </div>
      )}
    </>
  );
}
