
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
  paths: {
    anterior?: string;
    posterior?: string;
  };
};

const headRegions: HeadRegion[] = [
  { 
    id: "forehead", 
    name: "Forehead", 
    description: "Upper front of the head",
    paths: {
      anterior: "M60 50 C 80 35, 120 35, 140 50"
    }
  },
  { 
    id: "eyes", 
    name: "Eyes", 
    description: "Around the eyes",
    paths: {
      anterior: "M70 80 C 75 70, 85 65, 95 70 M130 80 C 125 70, 115 65, 105 70"
    }
  },
  { 
    id: "upperSinuses", 
    name: "Upper Sinuses", 
    description: "Upper nasal cavities",
    paths: {
      anterior: "M85 95 C 95 105, 105 105, 115 95"
    }
  },
  { 
    id: "lowerSinuses", 
    name: "Lower Sinuses", 
    description: "Lower nasal and cheek areas",
    paths: {
      anterior: "M80 115 C 90 125, 110 125, 120 115"
    }
  },
  { 
    id: "crown", 
    name: "Crown", 
    description: "Top of the head",
    paths: {
      posterior: "M70 40 C 80 30, 120 30, 130 40"
    }
  },
  { 
    id: "temple", 
    name: "Temple", 
    description: "Side of the head behind the eyes",
    paths: {
      posterior: "M40 80 C 45 70, 48 60, 50 50 M160 80 C 155 70, 152 60, 150 50",
      anterior: "M45 80 C 50 70, 53 60, 55 50 M155 80 C 150 70, 147 60, 145 50"
    }
  },
  { 
    id: "occipital", 
    name: "Occipital", 
    description: "Back of the head",
    paths: {
      posterior: "M60 100 C 60 140, 80 160, 100 160 C 120 160, 140 140, 140 100"
    }
  },
  { 
    id: "base", 
    name: "Base", 
    description: "Lower back of the head/upper neck",
    paths: {
      posterior: "M60 160 C 70 170, 130 170, 140 160"
    }
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

  // Filter regions by view
  const anteriorRegions = headRegions.filter(region => region.paths.anterior);
  const posteriorRegions = headRegions.filter(region => region.paths.posterior);

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Head Region</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Posterior View */}
            <div className="relative aspect-square">
              <svg viewBox="0 0 200 200" className="w-full h-full rounded-lg bg-gray-900/60">
                {/* Base skull outline */}
                <g stroke="white" fill="none" strokeWidth="1">
                  <path 
                    d="M100 20 C 60 20, 30 60, 30 100 C 30 140, 60 180, 100 180 C 140 180, 170 140, 170 100 C 170 60, 140 20, 100 20" 
                    strokeLinecap="round"
                  />
                  {/* Detail lines for pencil effect */}
                  <path d="M80 40 C 90 50, 110 50, 120 40" strokeLinecap="round" strokeDasharray="1,2" />
                  <path d="M50 70 C 70 90, 130 90, 150 70" strokeLinecap="round" strokeDasharray="1,2" />
                  <path d="M40 100 C 70 120, 130 120, 160 100" strokeLinecap="round" strokeDasharray="1,2" />
                </g>
                
                {/* Interactive regions */}
                <TooltipProvider>
                  {posteriorRegions.map((region) => (
                    <Tooltip key={region.id}>
                      <TooltipTrigger asChild>
                        <path 
                          d={region.paths.posterior}
                          className={cn(
                            "cursor-pointer stroke-[3px] hover:stroke-primary/60 fill-transparent transition-colors",
                            selectedRegion === region.id ? "stroke-primary fill-primary/10" : "stroke-white/30"
                          )}
                          onClick={() => handleRegionSelect(region.id)}
                          strokeLinecap="round"
                        />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-gray-800 text-white border-gray-700">
                        <p>{region.name}: {region.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </svg>
              <div className="absolute bottom-2 left-2 right-2 text-center bg-gray-900/70 text-xs text-white py-1 rounded">
                Posterior View
              </div>
            </div>
            
            {/* Anterior View */}
            <div className="relative aspect-square">
              <svg viewBox="0 0 200 200" className="w-full h-full rounded-lg bg-gray-900/60">
                {/* Base skull outline */}
                <g stroke="white" fill="none" strokeWidth="1">
                  <path 
                    d="M100 20 C 60 20, 30 60, 30 120 L 50 160 L 150 160 L 170 120 C 170 60, 140 20, 100 20"
                    strokeLinecap="round"
                  />
                  {/* Eyes outline */}
                  <ellipse cx="70" cy="80" rx="15" ry="10" />
                  <ellipse cx="130" cy="80" rx="15" ry="10" />
                  {/* Detail lines for pencil effect */}
                  <path d="M60 70 C 80 60, 120 60, 140 70" strokeLinecap="round" strokeDasharray="1,2" />
                  <path d="M70 100 C 85 110, 115 110, 130 100" strokeLinecap="round" strokeDasharray="1,2" />
                  <path d="M60 140 C 80 150, 120 150, 140 140" strokeLinecap="round" strokeDasharray="1,2" />
                </g>
                
                {/* Interactive regions */}
                <TooltipProvider>
                  {anteriorRegions.map((region) => (
                    <Tooltip key={region.id}>
                      <TooltipTrigger asChild>
                        <path 
                          d={region.paths.anterior}
                          className={cn(
                            "cursor-pointer stroke-[3px] hover:stroke-primary/60 fill-transparent transition-colors",
                            selectedRegion === region.id ? "stroke-primary fill-primary/10" : "stroke-white/30"
                          )}
                          onClick={() => handleRegionSelect(region.id)}
                          strokeLinecap="round"
                        />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-gray-800 text-white border-gray-700">
                        <p>{region.name}: {region.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </svg>
              <div className="absolute bottom-2 left-2 right-2 text-center bg-gray-900/70 text-xs text-white py-1 rounded">
                Anterior View
              </div>
            </div>
          </div>

          {/* Selected region indicator */}
          {selectedRegion && (
            <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-md">
              <p className="text-white">
                Selected: <span className="font-medium text-primary">{headRegions.find(r => r.id === selectedRegion)?.name}</span>
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
