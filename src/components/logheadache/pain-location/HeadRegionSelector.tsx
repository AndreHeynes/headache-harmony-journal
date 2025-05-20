
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface HeadRegionSelectorProps {
  selectedRegion: string | null;
  setSelectedRegion: (region: string) => void;
  viewMode: "anterior" | "posterior";
  toggleView: () => void;
}

const headRegions = {
  anterior: [
    { id: "forehead", name: "Forehead", top: "15%", left: "50%" },
    { id: "upperSinuses", name: "Upper Sinuses", top: "35%", left: "30%" },
    { id: "eyes", name: "Eyes", top: "35%", left: "70%" },
    { id: "leftTemple", name: "Temple", top: "48%", left: "10%" },
    { id: "rightTemple", name: "Temple", top: "48%", left: "90%" },
    { id: "lowerSinuses", name: "Lower Sinuses", top: "55%", left: "50%" }
  ],
  posterior: [
    { id: "topOfHead", name: "Top of head", top: "25%", left: "50%" },
    { id: "bumpOfHead", name: "Bump of head", top: "50%", left: "50%" },
    { id: "baseOfHead", name: "Base of head", top: "75%", left: "50%" }
  ]
};

export { headRegions };

export function HeadRegionSelector({ selectedRegion, setSelectedRegion, viewMode, toggleView }: HeadRegionSelectorProps) {
  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    const regionName = [...headRegions.anterior, ...headRegions.posterior]
      .find(r => r.id === region)?.name;
    
    toast({
      title: "Region selected",
      description: `You selected: ${regionName}`,
    });
  };

  return (
    <div className="space-y-6">
      <Button 
        variant="outline" 
        onClick={toggleView} 
        className="w-full bg-gray-700/40 text-white hover:bg-gray-700/60"
      >
        {viewMode === "anterior" ? "Switch to Back View" : "Switch to Front View"}
      </Button>

      <div className="relative w-full h-[400px]">
        {/* Head outline */}
        <div className="absolute inset-0 mx-auto w-3/4 h-full rounded-full border-2 border-cyan-400/40">
          {/* Side markers */}
          <div className="absolute top-1/2 -left-16 text-white text-2xl font-bold">LEFT</div>
          <div className="absolute top-1/2 -right-16 text-white text-2xl font-bold">RIGHT</div>
          
          {/* Face features (simplified) */}
          {viewMode === "anterior" && (
            <div className="absolute w-full h-full">
              {/* Simplified face outline */}
              <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 w-1/2 h-1/4 border-t-2 border-cyan-400/40 rounded-t-full"></div>
            </div>
          )}
          
          {/* Neck */}
          <div className="absolute -bottom-[20%] left-1/2 -translate-x-1/2 w-1/3 h-[20%] bg-transparent border-l-2 border-r-2 border-cyan-400/40"></div>
          
          {/* Pain regions */}
          {headRegions[viewMode].map((region) => (
            <Button
              key={region.id}
              onClick={() => handleRegionSelect(region.id)}
              className={`
                absolute transform -translate-x-1/2 -translate-y-1/2 
                bg-cyan-500/80 hover:bg-cyan-500 text-white
                border-2 min-w-[100px] py-2
                ${selectedRegion === region.id ? "border-white" : "border-cyan-200/30"}
              `}
              style={{
                top: region.top,
                left: region.left
              }}
            >
              {region.name}
            </Button>
          ))}
        </div>
      </div>
      
      {selectedRegion && (
        <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-md">
          <p className="text-white">
            Selected: <span className="font-medium text-primary">
              {[...headRegions.anterior, ...headRegions.posterior].find(r => r.id === selectedRegion)?.name}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
