
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface HeadRegionSelectorProps {
  selectedRegion: string | null;
  setSelectedRegion: (region: string) => void;
  viewMode: "anterior" | "posterior";
  toggleView: () => void;
}

export function HeadRegionSelector({ selectedRegion, setSelectedRegion, viewMode, toggleView }: HeadRegionSelectorProps) {
  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    const regionName = getRegionDisplayName(region);
    
    toast({
      title: "Region selected",
      description: `You selected: ${regionName}`,
    });
  };

  const getRegionDisplayName = (regionId: string): string => {
    const nameMap: Record<string, string> = {
      "forehead": "Forehead",
      "upper-sinuses": "Upper Sinuses",
      "eyes": "Eyes",
      "temple-left": "Left Temple",
      "temple-right": "Right Temple",
      "lower-sinuses": "Lower Sinuses",
      "top-head": "Top of head",
      "bump-head": "Bump of head",
      "base-head": "Base of head"
    };
    return nameMap[regionId] || regionId.replace(/-/g, ' ');
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

      <div className="relative w-full max-w-md mx-auto">
        <svg viewBox="0 0 300 200" className="w-full">
          {viewMode === "anterior" ? (
            // Anterior View
            <g id="anterior-view">
              <rect 
                id="forehead" 
                x="100" y="30" 
                width="100" height="30" 
                className={`fill-cyan-500/80 hover:fill-cyan-400 stroke-white stroke-1 cursor-pointer ${selectedRegion === 'forehead' ? 'stroke-2' : 'stroke-1'}`}
                onClick={() => handleRegionSelect('forehead')}
              />
              <text x="125" y="50" className="fill-white text-xs pointer-events-none font-medium">Forehead</text>

              <rect 
                id="upper-sinuses" 
                x="85" y="70" 
                width="60" height="30" 
                className={`fill-cyan-500/80 hover:fill-cyan-400 stroke-white stroke-1 cursor-pointer ${selectedRegion === 'upper-sinuses' ? 'stroke-2' : 'stroke-1'}`}
                onClick={() => handleRegionSelect('upper-sinuses')}
              />
              <text x="90" y="90" className="fill-white text-xs pointer-events-none font-medium">Upper Sinuses</text>

              <rect 
                id="eyes" 
                x="155" y="70" 
                width="60" height="30" 
                className={`fill-cyan-500/80 hover:fill-cyan-400 stroke-white stroke-1 cursor-pointer ${selectedRegion === 'eyes' ? 'stroke-2' : 'stroke-1'}`}
                onClick={() => handleRegionSelect('eyes')}
              />
              <text x="170" y="90" className="fill-white text-xs pointer-events-none font-medium">Eyes</text>

              <rect 
                id="temple-left" 
                x="50" y="80" 
                width="40" height="20" 
                className={`fill-cyan-500/80 hover:fill-cyan-400 stroke-white stroke-1 cursor-pointer ${selectedRegion === 'temple-left' ? 'stroke-2' : 'stroke-1'}`}
                onClick={() => handleRegionSelect('temple-left')}
              />
              <text x="52" y="95" className="fill-white text-xs pointer-events-none font-medium">Left Temple</text>

              <rect 
                id="temple-right" 
                x="210" y="80" 
                width="40" height="20" 
                className={`fill-cyan-500/80 hover:fill-cyan-400 stroke-white stroke-1 cursor-pointer ${selectedRegion === 'temple-right' ? 'stroke-2' : 'stroke-1'}`}
                onClick={() => handleRegionSelect('temple-right')}
              />
              <text x="212" y="95" className="fill-white text-xs pointer-events-none font-medium">Right Temple</text>
              
              <rect 
                id="lower-sinuses" 
                x="100" y="110" 
                width="100" height="30" 
                className={`fill-cyan-500/80 hover:fill-cyan-400 stroke-white stroke-1 cursor-pointer ${selectedRegion === 'lower-sinuses' ? 'stroke-2' : 'stroke-1'}`}
                onClick={() => handleRegionSelect('lower-sinuses')}
              />
              <text x="115" y="130" className="fill-white text-xs pointer-events-none font-medium">Lower Sinuses</text>

              {/* Side markers */}
              <text x="25" y="100" className="fill-white text-sm font-bold pointer-events-none">LEFT</text>
              <text x="250" y="100" className="fill-white text-sm font-bold pointer-events-none">RIGHT</text>
            </g>
          ) : (
            // Posterior View
            <g id="posterior-view">
              <rect 
                id="top-head" 
                x="100" y="30" 
                width="100" height="30" 
                className={`fill-cyan-500/80 hover:fill-cyan-400 stroke-white stroke-1 cursor-pointer ${selectedRegion === 'top-head' ? 'stroke-2' : 'stroke-1'}`}
                onClick={() => handleRegionSelect('top-head')}
              />
              <text x="125" y="50" className="fill-white text-xs pointer-events-none font-medium">Top of head</text>

              <rect 
                id="bump-head" 
                x="100" y="70" 
                width="100" height="30" 
                className={`fill-cyan-500/80 hover:fill-cyan-400 stroke-white stroke-1 cursor-pointer ${selectedRegion === 'bump-head' ? 'stroke-2' : 'stroke-1'}`}
                onClick={() => handleRegionSelect('bump-head')}
              />
              <text x="125" y="90" className="fill-white text-xs pointer-events-none font-medium">Bump of head</text>

              <rect 
                id="base-head" 
                x="100" y="110" 
                width="100" height="30" 
                className={`fill-cyan-500/80 hover:fill-cyan-400 stroke-white stroke-1 cursor-pointer ${selectedRegion === 'base-head' ? 'stroke-2' : 'stroke-1'}`}
                onClick={() => handleRegionSelect('base-head')}
              />
              <text x="125" y="130" className="fill-white text-xs pointer-events-none font-medium">Base of head</text>

              {/* Side markers */}
              <text x="25" y="100" className="fill-white text-sm font-bold pointer-events-none">LEFT</text>
              <text x="250" y="100" className="fill-white text-sm font-bold pointer-events-none">RIGHT</text>
            </g>
          )}
        </svg>
      </div>
      
      {selectedRegion && (
        <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-md">
          <p className="text-white">
            Selected: <span className="font-medium text-primary">
              {getRegionDisplayName(selectedRegion)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
