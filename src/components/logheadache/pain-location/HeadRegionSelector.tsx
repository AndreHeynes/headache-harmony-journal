
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
        <svg viewBox="0 0 300 600" className="w-full">
          {/* Anterior View */}
          {viewMode === "anterior" && (
            <g id="anterior-view">
              {/* Head outline */}
              <path 
                d="M150,50 C220,50 250,100 260,150 C270,200 260,250 240,280 C220,310 180,330 150,340 C120,330 80,310 60,280 C40,250 30,200 40,150 C50,100 80,50 150,50 Z" 
                fill="none" 
                stroke="#3E7D9C" 
                strokeWidth="2"
              />
              {/* Neck outline */}
              <path 
                d="M100,340 C100,380 95,400 95,420 C95,440 205,440 205,420 C205,400 200,380 200,340" 
                fill="none" 
                stroke="#3E7D9C" 
                strokeWidth="2"
              />
              
              {/* Forehead */}
              <rect 
                id="forehead" 
                x="108" y="75" 
                width="84" height="45" 
                rx="10" ry="10"
                className={`fill-cyan-500/80 hover:fill-cyan-400 stroke-white stroke-2 cursor-pointer ${selectedRegion === 'forehead' ? 'fill-cyan-400' : 'fill-cyan-500/80'}`}
                onClick={() => handleRegionSelect('forehead')}
              />
              <text x="120" y="105" className="fill-white text-sm font-medium pointer-events-none">Forehead</text>

              {/* Upper Sinuses */}
              <rect 
                id="upper-sinuses" 
                x="70" y="130" 
                width="75" height="45" 
                rx="10" ry="10"
                className={`fill-cyan-500/80 hover:fill-cyan-400 stroke-white stroke-2 cursor-pointer ${selectedRegion === 'upper-sinuses' ? 'fill-cyan-400' : 'fill-cyan-500/80'}`}
                onClick={() => handleRegionSelect('upper-sinuses')}
              />
              <text x="76" y="160" className="fill-white text-sm font-medium pointer-events-none">Upper</text>
              <text x="76" y="175" className="fill-white text-sm font-medium pointer-events-none">Sinuses</text>

              {/* Eyes */}
              <rect 
                id="eyes" 
                x="155" y="130" 
                width="75" height="45" 
                rx="10" ry="10"
                className={`fill-cyan-500/80 hover:fill-cyan-400 stroke-white stroke-2 cursor-pointer ${selectedRegion === 'eyes' ? 'fill-cyan-400' : 'fill-cyan-500/80'}`}
                onClick={() => handleRegionSelect('eyes')}
              />
              <text x="172" y="160" className="fill-white text-sm font-medium pointer-events-none">Eyes</text>

              {/* Temple Right */}
              <rect 
                id="temple-right" 
                x="230" y="185" 
                width="65" height="40" 
                rx="10" ry="10"
                className={`fill-cyan-500/80 hover:fill-cyan-400 stroke-white stroke-2 cursor-pointer ${selectedRegion === 'temple-right' ? 'fill-cyan-400' : 'fill-cyan-500/80'}`}
                onClick={() => handleRegionSelect('temple-right')}
              />
              <text x="234" y="210" className="fill-white text-sm font-medium pointer-events-none">Temple</text>
              
              {/* LEFT/RIGHT Labels */}
              <text x="20" y="170" className="fill-white text-xl font-bold pointer-events-none">LEFT</text>
              <text x="235" y="130" className="fill-white text-xl font-bold pointer-events-none">RIGHT</text>
            </g>
          )}
          
          {/* Posterior View */}
          {viewMode === "posterior" && (
            <g id="posterior-view" transform="translate(0, 0)">
              {/* Head outline */}
              <path 
                d="M150,50 C220,50 250,100 260,150 C270,200 260,250 240,280 C220,310 180,330 150,340 C120,330 80,310 60,280 C40,250 30,200 40,150 C50,100 80,50 150,50 Z" 
                fill="none" 
                stroke="#3E7D9C" 
                strokeWidth="2"
              />
              {/* Neck outline */}
              <path 
                d="M100,340 C100,380 95,400 95,420 C95,440 205,440 205,420 C205,400 200,380 200,340" 
                fill="none" 
                stroke="#3E7D9C" 
                strokeWidth="2"
              />

              {/* Top of head */}
              <rect 
                id="top-head" 
                x="100" y="90" 
                width="100" height="50" 
                rx="10" ry="10"
                className={`fill-cyan-500/80 hover:fill-cyan-400 stroke-white stroke-2 cursor-pointer ${selectedRegion === 'top-head' ? 'fill-cyan-400' : 'fill-cyan-500/80'}`}
                onClick={() => handleRegionSelect('top-head')}
              />
              <text x="112" y="120" className="fill-white text-sm font-medium pointer-events-none">Top of head</text>

              {/* Bump of head */}
              <rect 
                id="bump-head" 
                x="100" y="160" 
                width="100" height="50" 
                rx="10" ry="10"
                className={`fill-cyan-500/80 hover:fill-cyan-400 stroke-white stroke-2 cursor-pointer ${selectedRegion === 'bump-head' ? 'fill-cyan-400' : 'fill-cyan-500/80'}`}
                onClick={() => handleRegionSelect('bump-head')}
              />
              <text x="107" y="190" className="fill-white text-sm font-medium pointer-events-none">Bump of head</text>

              {/* Base of head */}
              <rect 
                id="base-head" 
                x="100" y="230" 
                width="100" height="50" 
                rx="10" ry="10"
                className={`fill-cyan-500/80 hover:fill-cyan-400 stroke-white stroke-2 cursor-pointer ${selectedRegion === 'base-head' ? 'fill-cyan-400' : 'fill-cyan-500/80'}`}
                onClick={() => handleRegionSelect('base-head')}
              />
              <text x="108" y="260" className="fill-white text-sm font-medium pointer-events-none">Base of head</text>

              {/* LEFT/RIGHT Labels */}
              <text x="20" y="170" className="fill-white text-xl font-bold pointer-events-none">LEFT</text>
              <text x="235" y="170" className="fill-white text-xl font-bold pointer-events-none">RIGHT</text>
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
