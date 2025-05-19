
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

type HeadRegion = {
  id: string;
  name: string;
  description: string;
  path: string;
  position: "anterior" | "posterior" | "both";
};

const headRegions: HeadRegion[] = [
  { 
    id: "frontLeft", 
    name: "Front Left", 
    description: "Left side of the forehead and temple",
    path: "M50 80 L80 80 L80 120 L50 120 Z",
    position: "anterior"
  },
  { 
    id: "frontRight", 
    name: "Front Right", 
    description: "Right side of the forehead and temple",
    path: "M120 80 L150 80 L150 120 L120 120 Z",
    position: "anterior"
  },
  { 
    id: "centerFront", 
    name: "Center Front", 
    description: "Central forehead",
    path: "M80 80 L120 80 L120 120 L80 120 Z",
    position: "anterior"
  },
  { 
    id: "lowerFace", 
    name: "Lower Face", 
    description: "Jaw and lower facial area",
    path: "M50 120 L150 120 L150 150 L100 170 L50 150 Z",
    position: "anterior"
  },
  { 
    id: "backLower", 
    name: "Back Lower", 
    description: "Lower back of the head and neck",
    path: "M50 140 L150 140 L150 170 L100 180 L50 170 Z",
    position: "posterior"
  },
  { 
    id: "backCenter", 
    name: "Back Center", 
    description: "Central back of the head",
    path: "M50 80 L150 80 L150 140 L50 140 Z",
    position: "posterior"
  }
];

export default function LogPainLocation() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [painDistribution, setPainDistribution] = useState<string | null>(null);
  const [painPattern, setPainPattern] = useState("medial");
  const [painSpreads, setPainSpreads] = useState(false);
  const [spreadPattern, setSpreadPattern] = useState("remain");

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    toast({
      title: "Region selected",
      description: `You selected: ${region}`,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-8">
          <h2 className="text-lg font-medium text-white text-center">Where did the pain start?</h2>
          
          <div className="grid grid-cols-1 gap-8">
            {/* Anterior View */}
            <div className="relative aspect-square mx-auto max-w-md">
              <div className="absolute top-0 left-4 text-gray-300">Right</div>
              <div className="absolute top-0 right-4 text-gray-300">Left</div>
              
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Base outline */}
                <path 
                  d="M100 30 C 60 30, 40 70, 40 120 C 40 140, 60 160, 100 180 C 140 160, 160 140, 160 120 C 160 70, 140 30, 100 30" 
                  stroke="#0EA5E9" 
                  strokeWidth="1" 
                  fill="none"
                />
                
                {/* Center dividing line */}
                <line 
                  x1="100" y1="30" 
                  x2="100" y2="180" 
                  stroke="#0EA5E9" 
                  strokeWidth="1" 
                  strokeDasharray="5,5" 
                />
                
                {/* Eye outline */}
                <ellipse 
                  cx="100" cy="110" 
                  rx="25" ry="10" 
                  stroke="#0EA5E9" 
                  strokeWidth="1" 
                  fill="none" 
                />
                
                {/* Interactive regions */}
                <TooltipProvider>
                  {headRegions
                    .filter(region => region.position === "anterior" || region.position === "both")
                    .map((region) => (
                      <Tooltip key={region.id}>
                        <TooltipTrigger asChild>
                          <path 
                            d={region.path}
                            className={cn(
                              "cursor-pointer transition-colors opacity-80",
                              selectedRegion === region.id 
                                ? "fill-emerald-500 stroke-cyan-300 stroke-[1.5px]" 
                                : "fill-transparent hover:fill-cyan-500/30 stroke-cyan-500/50"
                            )}
                            onClick={() => handleRegionSelect(region.id)}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-gray-800 text-white border-gray-700">
                          <p>{region.name}: {region.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                </TooltipProvider>
              </svg>
            </div>
            
            {/* Posterior View */}
            <div className="relative aspect-square mx-auto max-w-md">
              <div className="absolute bottom-0 left-4 text-gray-300">Left</div>
              <div className="absolute bottom-0 right-4 text-gray-300">Right</div>
              
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Base outline */}
                <path 
                  d="M100 30 C 60 30, 40 70, 40 120 C 40 140, 60 160, 100 180 C 140 160, 160 140, 160 120 C 160 70, 140 30, 100 30" 
                  stroke="#0EA5E9" 
                  strokeWidth="1" 
                  fill="none"
                />
                
                {/* Center dividing line */}
                <line 
                  x1="100" y1="30" 
                  x2="100" y2="180" 
                  stroke="#0EA5E9" 
                  strokeWidth="1" 
                  strokeDasharray="5,5" 
                />

                {/* Interactive regions */}
                <TooltipProvider>
                  {headRegions
                    .filter(region => region.position === "posterior" || region.position === "both")
                    .map((region) => (
                      <Tooltip key={region.id}>
                        <TooltipTrigger asChild>
                          <path 
                            d={region.path}
                            className={cn(
                              "cursor-pointer transition-colors opacity-80",
                              selectedRegion === region.id 
                                ? "fill-emerald-500 stroke-cyan-300 stroke-[1.5px]" 
                                : "fill-transparent hover:fill-cyan-500/30 stroke-cyan-500/50"
                            )}
                            onClick={() => handleRegionSelect(region.id)}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-gray-800 text-white border-gray-700">
                          <p>{region.name}: {region.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                </TooltipProvider>
              </svg>
            </div>
          </div>

          {/* Selected region indicator */}
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
      </Card>

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Pain Distribution</h2>
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="secondary" 
              className={cn(
                "bg-gray-700/40 hover:bg-gray-700/60 text-white",
                painDistribution === "left" && "bg-primary/50 border border-primary"
              )}
              onClick={() => setPainDistribution("left")}
            >
              Left Side
            </Button>
            <Button 
              variant="secondary" 
              className={cn(
                "bg-gray-700/40 hover:bg-gray-700/60 text-white",
                painDistribution === "both" && "bg-primary/50 border border-primary"
              )}
              onClick={() => setPainDistribution("both")}
            >
              Both Sides
            </Button>
            <Button 
              variant="secondary" 
              className={cn(
                "bg-gray-700/40 hover:bg-gray-700/60 text-white",
                painDistribution === "right" && "bg-primary/50 border border-primary"
              )}
              onClick={() => setPainDistribution("right")}
            >
              Right Side
            </Button>
          </div>
        </div>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Distribution Pattern</h2>
          <RadioGroup value={painPattern} onValueChange={setPainPattern}>
            <div className="space-y-3">
              <Label className="flex items-center p-3 rounded-lg border border-gray-700 bg-gray-700/40">
                <RadioGroupItem value="medial" className="text-primary" />
                <span className="ml-3 text-white">Medial (inner)</span>
              </Label>
              <Label className="flex items-center p-3 rounded-lg border border-gray-700 bg-gray-700/40">
                <RadioGroupItem value="lateral" className="text-primary" />
                <span className="ml-3 text-white">Lateral (outer)</span>
              </Label>
              <Label className="flex items-center p-3 rounded-lg border border-gray-700 bg-gray-700/40">
                <RadioGroupItem value="both" className="text-primary" />
                <span className="ml-3 text-white">Both (broad)</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-white">Does Pain spread?</h2>
            <Switch checked={painSpreads} onCheckedChange={setPainSpreads} />
          </div>

          {painSpreads && (
            <RadioGroup value={spreadPattern} onValueChange={setSpreadPattern}>
              <div className="space-y-3">
                <Label className="flex items-center p-3 rounded-lg border border-gray-700 bg-gray-700/40">
                  <RadioGroupItem value="remain" className="text-primary" />
                  <span className="ml-3 text-white">Remain on starting side</span>
                </Label>
                <Label className="flex items-center p-3 rounded-lg border border-gray-700 bg-gray-700/40">
                  <RadioGroupItem value="change" className="text-primary" />
                  <span className="ml-3 text-white">Changes to opposite side</span>
                </Label>
                <Label className="flex items-center p-3 rounded-lg border border-gray-700 bg-gray-700/40">
                  <RadioGroupItem value="return" className="text-primary" />
                  <span className="ml-3 text-white">Changes side and returns</span>
                </Label>
              </div>
            </RadioGroup>
          )}
        </div>
      </Card>
    </div>
  );
}
