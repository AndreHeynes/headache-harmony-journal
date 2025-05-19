
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { Skull } from "lucide-react";

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
    path: "M80 30 C65 30, 55 60, 55 100 C55 120, 65 130, 80 140 L80 30 Z",
    position: "anterior"
  },
  { 
    id: "frontRight", 
    name: "Front Right", 
    description: "Right side of the forehead and temple",
    path: "M120 30 C135 30, 145 60, 145 100 C145 120, 135 130, 120 140 L120 30 Z",
    position: "anterior"
  },
  { 
    id: "centerFront", 
    name: "Center Front", 
    description: "Central forehead",
    path: "M80 30 L120 30 L120 140 L80 140 Z",
    position: "anterior"
  },
  { 
    id: "lowerFace", 
    name: "Lower Face", 
    description: "Jaw and lower facial area",
    path: "M55 100 C55 135, 75 160, 100 170 C125 160, 145 135, 145 100 L145 120 C145 130, 135 150, 100 165 C65 150, 55 130, 55 120 Z",
    position: "anterior"
  },
  { 
    id: "backLower", 
    name: "Occipital (Back Lower)", 
    description: "Lower back of the head and neck",
    path: "M55 100 C55 135, 75 160, 100 170 C125 160, 145 135, 145 100 L145 120 C145 130, 135 150, 100 165 C65 150, 55 130, 55 120 Z",
    position: "posterior"
  },
  { 
    id: "backCenter", 
    name: "Parietal (Back Center)", 
    description: "Central back of the head",
    path: "M55 30 C55 70, 65 90, 100 100 C135 90, 145 70, 145 30 Z",
    position: "posterior"
  },
  { 
    id: "backLeft", 
    name: "Left Temporal", 
    description: "Left side of the head",
    path: "M55 30 C40 60, 40 100, 55 120 L55 30 Z",
    position: "posterior"
  },
  { 
    id: "backRight", 
    name: "Right Temporal", 
    description: "Right side of the head",
    path: "M145 30 C160 60, 160 100, 145 120 L145 30 Z",
    position: "posterior"
  }
];

export default function LogPainLocation() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [painDistribution, setPainDistribution] = useState<string | null>(null);
  const [painPattern, setPainPattern] = useState("medial");
  const [painSpreads, setPainSpreads] = useState(false);
  const [spreadPattern, setSpreadPattern] = useState("remain");
  const [viewMode, setViewMode] = useState<"anterior" | "posterior">("anterior");

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    toast({
      title: "Region selected",
      description: `You selected: ${headRegions.find(r => r.id === region)?.name}`,
    });
  };

  const toggleView = () => {
    setViewMode(viewMode === "anterior" ? "posterior" : "anterior");
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-white">Where did the pain start?</h2>
            <Button 
              variant="outline" 
              onClick={toggleView} 
              className="bg-gray-700/40 text-gray-200 hover:bg-gray-700/60"
            >
              {viewMode === "anterior" ? "View Back of Head" : "View Front of Head"}
              <Skull className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="relative aspect-square mx-auto max-w-md">
            <TooltipProvider>
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Skull outline */}
                <path 
                  d="M100 15
                     C 60 15, 40 60, 40 110
                     C 40 140, 60 165, 100 185
                     C 140 165, 160 140, 160 110
                     C 160 60, 140 15, 100 15"
                  stroke="#8E9196"
                  strokeWidth="2"
                  fill="none"
                />
                
                {viewMode === "anterior" ? (
                  <>
                    {/* Face features for anterior view */}
                    <g stroke="#8E9196" strokeWidth="1" fill="none">
                      {/* Eyes */}
                      <ellipse cx="75" cy="90" rx="12" ry="8" />
                      <ellipse cx="125" cy="90" rx="12" ry="8" />
                      
                      {/* Nose */}
                      <path d="M100 95 L100 115 M85 115 L100 115 L115 115" />
                      
                      {/* Mouth */}
                      <path d="M75 135 C85 143, 115 143, 125 135" />
                    </g>
                  </>
                ) : (
                  <>
                    {/* Back of head features */}
                    <g stroke="#8E9196" strokeWidth="1" fill="none">
                      {/* Back of skull ridge */}
                      <path d="M60 80 C75 70, 125 70, 140 80" />
                      
                      {/* Occipital protrusion */}
                      <path d="M100 165 C100 155, 100 155, 100 145" />
                    </g>
                  </>
                )}
                
                {/* Interactive regions */}
                {headRegions
                  .filter(region => region.position === viewMode || region.position === "both")
                  .map((region) => (
                    <Tooltip key={region.id}>
                      <TooltipTrigger asChild>
                        <path 
                          d={region.path}
                          className={cn(
                            "cursor-pointer transition-colors opacity-80",
                            selectedRegion === region.id 
                              ? "fill-emerald-500 stroke-cyan-300 stroke-[1.5px]" 
                              : "fill-transparent hover:fill-cyan-500/30 stroke-cyan-500/50 hover:stroke-cyan-300/80"
                          )}
                          onClick={() => handleRegionSelect(region.id)}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-gray-800 text-white border-gray-700">
                        <p>{region.name}: {region.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
              </svg>
            </TooltipProvider>
            
            <div className="absolute bottom-0 left-0 text-gray-300 text-xs">
              {viewMode === "anterior" ? "Anterior View" : "Posterior View"}
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
