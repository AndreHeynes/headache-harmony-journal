
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { HeadSvgDisplay } from "./HeadSvgDisplay";
import { SelectionStatus } from "./SelectionStatus";
import { HeadRegionSelectorProps, DraggableRegion } from "./types";
import { anteriorRegionsData, posteriorRegionsData, getRegionDisplayName } from "./region-utils";

export function HeadRegionSelector({ 
  selectedRegion, 
  setSelectedRegion, 
  viewMode, 
  toggleView 
}: HeadRegionSelectorProps) {
  const [anteriorRegions, setAnteriorRegions] = useState<DraggableRegion[]>(anteriorRegionsData);
  const [posteriorRegions, setPosteriorRegions] = useState<DraggableRegion[]>(posteriorRegionsData);
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
      setActiveRegion(null);
    }
  };

  useEffect(() => {
    if (activeRegion) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeRegion, dragOffset]);

  const getCurrentRegions = () => {
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

      <div className="relative w-full max-w-lg mx-auto">
        <HeadSvgDisplay
          viewMode={viewMode}
          regions={getCurrentRegions()}
          selectedRegion={selectedRegion}
          activeRegion={activeRegion}
          onRegionSelect={handleRegionSelect}
          onRegionMouseDown={handleMouseDown}
          svgRef={svgRef}
        />
      </div>
      
      <SelectionStatus
        selectedRegion={selectedRegion}
        activeRegion={activeRegion}
      />
    </div>
  );
}
