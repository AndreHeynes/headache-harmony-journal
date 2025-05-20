
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface HeadRegionSelectorProps {
  selectedRegion: string | null;
  setSelectedRegion: (region: string) => void;
  viewMode: "anterior" | "posterior";
  toggleView: () => void;
}

interface DraggableRegion {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
}

export function HeadRegionSelector({ selectedRegion, setSelectedRegion, viewMode, toggleView }: HeadRegionSelectorProps) {
  const [anteriorRegions, setAnteriorRegions] = useState<DraggableRegion[]>([
    { id: "forehead", x: 110, y: 75, width: 80, height: 30, name: "Forehead" },
    { id: "upper-sinuses", x: 85, y: 115, width: 65, height: 30, name: "Upper Sinuses" },
    { id: "lower-sinuses", x: 85, y: 155, width: 65, height: 30, name: "Lower Sinuses" },
    { id: "eyes-left", x: 160, y: 115, width: 55, height: 30, name: "Left Eye" },
    { id: "eyes-right", x: 160, y: 155, width: 55, height: 30, name: "Right Eye" },
    { id: "temple-left", x: 50, y: 135, width: 60, height: 30, name: "Left Temple" },
    { id: "temple-right", x: 190, y: 135, width: 60, height: 30, name: "Right Temple" },
  ]);

  const [posteriorRegions, setPosteriorRegions] = useState<DraggableRegion[]>([
    { id: "top-head", x: 110, y: 90, width: 80, height: 30, name: "Top of head" },
    { id: "bump-head", x: 110, y: 160, width: 80, height: 30, name: "Bump of head" },
    { id: "base-head", x: 110, y: 230, width: 80, height: 30, name: "Base of head" },
  ]);

  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  
  const handleRegionSelect = (region: string) => {
    if (activeRegion === region) {
      setActiveRegion(null);
      setSelectedRegion(region);
      const regionName = getRegionDisplayName(region);
      
      toast({
        title: "Region selected",
        description: `You selected: ${regionName}`,
      });
    } else {
      setActiveRegion(region);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, regionId: string) => {
    if (activeRegion === regionId) {
      const svgRect = svgRef.current?.getBoundingClientRect();
      if (svgRect) {
        const x = e.clientX - svgRect.left;
        const y = e.clientY - svgRect.top;
        
        // Find region to get its position
        const regions = viewMode === "anterior" ? anteriorRegions : posteriorRegions;
        const region = regions.find(r => r.id === regionId);
        
        if (region) {
          setDragOffset({ 
            x: x - region.x, 
            y: y - region.y 
          });
        }
        
        // Prevent text selection during drag
        e.preventDefault();
      }
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (activeRegion && svgRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const x = e.clientX - svgRect.left;
      const y = e.clientY - svgRect.top;
      
      if (viewMode === "anterior") {
        setAnteriorRegions(prev => 
          prev.map(region => 
            region.id === activeRegion 
              ? { 
                  ...region, 
                  x: x - dragOffset.x, 
                  y: y - dragOffset.y 
                } 
              : region
          )
        );
      } else {
        setPosteriorRegions(prev => 
          prev.map(region => 
            region.id === activeRegion 
              ? { 
                  ...region, 
                  x: x - dragOffset.x, 
                  y: y - dragOffset.y 
                } 
              : region
          )
        );
      }
    }
  };

  const handleMouseUp = () => {
    if (activeRegion) {
      // Remove active region to stop dragging
      setActiveRegion(null);
    }
  };

  useEffect(() => {
    // Add event listeners for dragging
    if (activeRegion) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeRegion, dragOffset]);

  const getRegionDisplayName = (regionId: string): string => {
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

  const getRegionsForCurrentView = () => {
    return viewMode === "anterior" ? anteriorRegions : posteriorRegions;
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
        <svg ref={svgRef} viewBox="0 0 300 400" className="w-full">
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
              
              {/* Render anterior regions */}
              {anteriorRegions.map((region) => (
                <g key={region.id}>
                  <rect 
                    id={region.id}
                    x={region.x} 
                    y={region.y} 
                    width={region.width} 
                    height={region.height} 
                    rx="10" 
                    ry="10"
                    className={`fill-cyan-500/80 hover:fill-cyan-400 stroke-white stroke-2 cursor-pointer ${
                      selectedRegion === region.id ? 'fill-cyan-400' : 
                      activeRegion === region.id ? 'fill-cyan-300' : 'fill-cyan-500/80'
                    }`}
                    onClick={() => handleRegionSelect(region.id)}
                    onMouseDown={(e) => handleMouseDown(e, region.id)}
                  />
                  <text 
                    x={region.x + region.width/2 - (region.name.length * 2.5)} 
                    y={region.y + region.height/2 + 5} 
                    className="fill-white text-xs font-medium pointer-events-none"
                  >
                    {region.name}
                  </text>
                </g>
              ))}
              
              {/* LEFT/RIGHT Labels */}
              <text x="10" y="170" className="fill-white text-xl font-bold pointer-events-none">LEFT</text>
              <text x="245" y="170" className="fill-white text-xl font-bold pointer-events-none">RIGHT</text>
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

              {/* Render posterior regions */}
              {posteriorRegions.map((region) => (
                <g key={region.id}>
                  <rect 
                    id={region.id}
                    x={region.x} 
                    y={region.y} 
                    width={region.width} 
                    height={region.height} 
                    rx="10" 
                    ry="10"
                    className={`fill-cyan-500/80 hover:fill-cyan-400 stroke-white stroke-2 cursor-pointer ${
                      selectedRegion === region.id ? 'fill-cyan-400' : 
                      activeRegion === region.id ? 'fill-cyan-300' : 'fill-cyan-500/80'
                    }`}
                    onClick={() => handleRegionSelect(region.id)}
                    onMouseDown={(e) => handleMouseDown(e, region.id)}
                  />
                  <text 
                    x={region.x + region.width/2 - (region.name.length * 2.5)} 
                    y={region.y + region.height/2 + 5} 
                    className="fill-white text-xs font-medium pointer-events-none"
                  >
                    {region.name}
                  </text>
                </g>
              ))}

              {/* LEFT/RIGHT Labels */}
              <text x="5" y="170" className="fill-white text-xl font-bold pointer-events-none">LEFT</text>
              <text x="250" y="170" className="fill-white text-xl font-bold pointer-events-none">RIGHT</text>
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

      {activeRegion && (
        <div className="mt-2 p-2 bg-cyan-500/20 border border-cyan-500/50 rounded-md">
          <p className="text-sm text-white">
            <span className="font-medium">Drag Mode:</span> Click to place "{getRegionDisplayName(activeRegion)}"
          </p>
        </div>
      )}
    </div>
  );
}
