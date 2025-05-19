
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skull } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

type HeadRegion = {
  id: string;
  name: string;
  description: string;
  position: "anterior" | "posterior" | "both";
};

interface HeadRegionSelectorProps {
  selectedRegion: string | null;
  setSelectedRegion: (region: string) => void;
  viewMode: "anterior" | "posterior";
  toggleView: () => void;
}

const headRegions: HeadRegion[] = [
  { 
    id: "frontLeft", 
    name: "Front Left", 
    description: "Left side of the forehead and temple",
    position: "anterior"
  },
  { 
    id: "frontRight", 
    name: "Front Right", 
    description: "Right side of the forehead and temple",
    position: "anterior"
  },
  { 
    id: "centerFront", 
    name: "Center Front", 
    description: "Central forehead",
    position: "anterior"
  },
  { 
    id: "lowerFace", 
    name: "Lower Face", 
    description: "Jaw and lower facial area",
    position: "anterior"
  },
  { 
    id: "backLower", 
    name: "Occipital (Back Lower)", 
    description: "Lower back of the head and neck",
    position: "posterior"
  },
  { 
    id: "backCenter", 
    name: "Parietal (Back Center)", 
    description: "Central back of the head",
    position: "posterior"
  },
  { 
    id: "backLeft", 
    name: "Left Temporal", 
    description: "Left side of the head",
    position: "posterior"
  },
  { 
    id: "backRight", 
    name: "Right Temporal", 
    description: "Right side of the head",
    position: "posterior"
  }
];

export { headRegions };

export function HeadRegionSelector({ selectedRegion, setSelectedRegion, viewMode, toggleView }: HeadRegionSelectorProps) {
  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    toast({
      title: "Region selected",
      description: `You selected: ${headRegions.find(r => r.id === region)?.name}`,
    });
  };

  return (
    <div className="relative mx-auto max-w-md">
      <div className="flex flex-col items-center">
        <Skull 
          className={`w-40 h-40 ${viewMode === "anterior" ? "text-cyan-400" : "text-cyan-600"}`} 
          strokeWidth={1.5}
        />
        <p className="text-gray-300 mt-2">
          {viewMode === "anterior" ? "Front View" : "Back View"}
        </p>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-3">
        {headRegions
          .filter(region => region.position === viewMode || region.position === "both")
          .map((region) => (
            <Button 
              key={region.id}
              onClick={() => handleRegionSelect(region.id)}
              variant="secondary"
              className={`
                bg-gray-700/40 hover:bg-gray-700/60 text-white text-left
                ${selectedRegion === region.id ? "border-2 border-emerald-500" : "border border-gray-600"}
              `}
            >
              <div>
                <div className="font-medium">{region.name}</div>
                <div className="text-xs text-gray-300">{region.description}</div>
              </div>
            </Button>
          ))}
      </div>

      {selectedRegion && (
        <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-md">
          <p className="text-white">
            Selected: <span className="font-medium text-primary">
              {headRegions.find(r => r.id === selectedRegion)?.name}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
