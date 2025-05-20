
import { DraggableRegion } from "./types";

interface HeadSvgDisplayProps {
  viewMode: "anterior" | "posterior";
  regions: DraggableRegion[];
  selectedRegion: string | null;
  activeRegion: string | null;
  onRegionSelect: (region: string) => void;
  svgRef: React.RefObject<SVGSVGElement>;
}

export function HeadSvgDisplay({
  viewMode,
  regions,
  selectedRegion,
  activeRegion,
  onRegionSelect,
  svgRef
}: HeadSvgDisplayProps) {
  return (
    <svg ref={svgRef} viewBox="0 0 380 400" className="w-full">
      {viewMode === "anterior" ? (
        <g id="anterior-view">
          {/* Head outline - centering between LEFT and RIGHT labels and moved more towards LEFT */}
          <path 
            d="M170,50 C240,50 270,100 280,150 C290,200 280,250 260,280 C240,310 200,330 170,340 C140,330 100,310 80,280 C60,250 50,200 60,150 C70,100 100,50 170,50 Z" 
            fill="none" 
            stroke="#3E7D9C" 
            strokeWidth="2"
          />
          {/* Neck outline - moved to match head position */}
          <path 
            d="M120,340 C120,380 115,400 115,420 C115,440 225,440 225,420 C225,400 220,380 220,340" 
            fill="none" 
            stroke="#3E7D9C" 
            strokeWidth="2"
          />
          
          {/* Render regions */}
          {regions.map((region) => (
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
                  selectedRegion === region.id ? 'fill-cyan-400' : 'fill-cyan-500/80'
                }`}
                onClick={() => onRegionSelect(region.id)}
              />
              <text 
                x={region.x + region.width/2 - (region.name.length * 1.5)} 
                y={region.y + region.height/2 + 4} 
                className="fill-white text-[8px] font-medium pointer-events-none"
              >
                {region.name}
              </text>
            </g>
          ))}
          
          {/* LEFT/RIGHT Labels - switched sides */}
          <text x="5" y="170" className="fill-white text-sm font-bold pointer-events-none">RIGHT</text>
          <text x="330" y="170" className="fill-white text-sm font-bold pointer-events-none">LEFT</text>
        </g>
      ) : (
        <g id="posterior-view" transform="translate(0, 0)">
          {/* Head outline - moved more towards LEFT */}
          <path 
            d="M170,50 C240,50 270,100 280,150 C290,200 280,250 260,280 C240,310 200,330 170,340 C140,330 100,310 80,280 C60,250 50,200 60,150 C70,100 100,50 170,50 Z" 
            fill="none" 
            stroke="#3E7D9C" 
            strokeWidth="2"
          />
          {/* Neck outline - moved to match head position */}
          <path 
            d="M120,340 C120,380 115,400 115,420 C115,440 225,440 225,420 C225,400 220,380 220,340" 
            fill="none" 
            stroke="#3E7D9C" 
            strokeWidth="2"
          />

          {/* Render regions */}
          {regions.map((region) => (
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
                  selectedRegion === region.id ? 'fill-cyan-400' : 'fill-cyan-500/80'
                }`}
                onClick={() => onRegionSelect(region.id)}
              />
              <text 
                x={region.x + region.width/2 - (region.name.length * 1.5)} 
                y={region.y + region.height/2 + 4} 
                className="fill-white text-[8px] font-medium pointer-events-none"
              >
                {region.name}
              </text>
            </g>
          ))}

          {/* LEFT/RIGHT Labels - switched sides */}
          <text x="5" y="170" className="fill-white text-sm font-bold pointer-events-none">RIGHT</text>
          <text x="330" y="170" className="fill-white text-sm font-bold pointer-events-none">LEFT</text>
        </g>
      )}
    </svg>
  );
}
