
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { HeadSvgDisplay } from "./HeadSvgDisplay";
import { SelectionStatus } from "./SelectionStatus";
import { HeadRegionSelectorProps } from "./types";
import { anteriorRegionsData, posteriorRegionsData, getRegionDisplayName } from "./region-utils";

export function HeadRegionSelector({ 
  selectedRegion, 
  setSelectedRegion, 
  viewMode, 
  toggleView 
}: HeadRegionSelectorProps) {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const handleRegionSelect = (region: string) => {
    setActiveRegion(null);
    setSelectedRegion(region);
    const regionName = getRegionDisplayName(region);
    
    toast({
      title: "Region selected",
      description: `You selected: ${regionName}`,
    });
  };

  const getCurrentRegions = () => {
    return viewMode === "anterior" ? anteriorRegionsData : posteriorRegionsData;
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

      <div className="relative w-full max-w-lg mx-auto">
        <HeadSvgDisplay
          viewMode={viewMode}
          regions={getCurrentRegions()}
          selectedRegion={selectedRegion}
          activeRegion={null}
          onRegionSelect={handleRegionSelect}
          svgRef={svgRef}
        />
      </div>
      
      <SelectionStatus
        selectedRegion={selectedRegion}
        activeRegion={null}
      />
    </div>
  );
}
