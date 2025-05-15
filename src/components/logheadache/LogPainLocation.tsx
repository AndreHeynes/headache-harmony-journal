
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

type HeadRegion = {
  id: string;
  name: string;
  description: string;
};

const posteriorRegions: HeadRegion[] = [
  { id: "crown", name: "Crown", description: "Top of the head" },
  { id: "temple", name: "Temple", description: "Side of the head behind the eyes" },
  { id: "base", name: "Base", description: "Lower back of the head/upper neck" },
  { id: "occipital", name: "Occipital", description: "Back of the head" }
];

const anteriorRegions: HeadRegion[] = [
  { id: "forehead", name: "Forehead", description: "Upper front of the head" },
  { id: "eyes", name: "Eyes", description: "Around the eyes" },
  { id: "upperSinuses", name: "Upper Sinuses", description: "Upper nasal cavities" },
  { id: "lowerSinuses", name: "Lower Sinuses", description: "Lower nasal and cheek areas" }
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
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-medium text-white">Head Region</h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Posterior View */}
              <div className="relative aspect-square">
                <svg viewBox="0 0 200 200" className="w-full h-full rounded-lg bg-gray-900/60">
                  {/* Refined posterior view skull with pencil outline style */}
                  <g stroke="white" fill="none" strokeWidth="1" className="pencil-outline">
                    {/* Skull outline */}
                    <path 
                      d="M100 20 C 60 20, 30 60, 30 100 C 30 140, 60 180, 100 180 C 140 180, 170 140, 170 100 C 170 60, 140 20, 100 20" 
                      strokeLinecap="round"
                    />
                    {/* Crown area - top of the head */}
                    <path 
                      d="M70 40 C 80 30, 120 30, 130 40" 
                      strokeDasharray="2,1"
                      className={cn(selectedRegion === "crown" ? "stroke-primary stroke-[2px]" : "")}
                    />
                    {/* Temple area - sides of the head */}
                    <path 
                      d="M40 80 C 45 70, 48 60, 50 50" 
                      strokeDasharray="2,1"
                      className={cn(selectedRegion === "temple" ? "stroke-primary stroke-[2px]" : "")}
                    />
                    <path 
                      d="M160 80 C 155 70, 152 60, 150 50" 
                      strokeDasharray="2,1"
                      className={cn(selectedRegion === "temple" ? "stroke-primary stroke-[2px]" : "")}
                    />
                    {/* Occipital bone */}
                    <path 
                      d="M60 100 C 60 140, 80 160, 100 160 C 120 160, 140 140, 140 100" 
                      strokeDasharray="2,1"
                      className={cn(selectedRegion === "occipital" ? "stroke-primary stroke-[2px]" : "")}
                    />
                    {/* Base of the skull */}
                    <path 
                      d="M60 160 C 70 170, 130 170, 140 160" 
                      strokeDasharray="2,1"
                      className={cn(selectedRegion === "base" ? "stroke-primary stroke-[2px]" : "")}
                    />
                    {/* Some detailed lines to give it a pencil-drawn feel */}
                    <path d="M80 40 C 90 50, 110 50, 120 40" strokeLinecap="round" strokeDasharray="1,2" />
                    <path d="M50 70 C 70 90, 130 90, 150 70" strokeLinecap="round" strokeDasharray="1,2" />
                    <path d="M40 100 C 70 120, 130 120, 160 100" strokeLinecap="round" strokeDasharray="1,2" />
                  </g>
                </svg>
                <div className="absolute inset-0">
                  <div className="grid grid-cols-2 grid-rows-2 h-full gap-1 p-1">
                    {posteriorRegions.map((region) => (
                      <Popover key={region.id}>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="secondary" 
                            className={cn(
                              "bg-white/40 hover:bg-white/50 text-gray-900 transition-all",
                              selectedRegion === region.id && "bg-primary/70 text-white ring-2 ring-primary"
                            )}
                            onClick={() => handleRegionSelect(region.id)}
                          >
                            {region.name}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="bg-gray-800 text-white border-gray-700 w-60">
                          <p className="text-sm">{region.description}</p>
                        </PopoverContent>
                      </Popover>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Anterior View */}
              <div className="relative aspect-square">
                <svg viewBox="0 0 200 200" className="w-full h-full rounded-lg bg-gray-900/60">
                  {/* Refined front view skull with pencil outline style */}
                  <g stroke="white" fill="none" strokeWidth="1" className="pencil-outline">
                    {/* Head outline */}
                    <path 
                      d="M100 20 C 60 20, 30 60, 30 120 L 50 160 L 150 160 L 170 120 C 170 60, 140 20, 100 20"
                      strokeLinecap="round"
                    />
                    
                    {/* Forehead area */}
                    <path 
                      d="M60 50 C 80 35, 120 35, 140 50" 
                      strokeDasharray="2,1"
                      className={cn(selectedRegion === "forehead" ? "stroke-primary stroke-[2px]" : "")}
                    />
                    
                    {/* Eyes */}
                    <ellipse 
                      cx="70" cy="80" rx="15" ry="10" 
                      strokeDasharray="2,1"
                      className={cn(selectedRegion === "eyes" ? "stroke-primary stroke-[2px]" : "")}
                    />
                    <ellipse 
                      cx="130" cy="80" rx="15" ry="10" 
                      strokeDasharray="2,1"
                      className={cn(selectedRegion === "eyes" ? "stroke-primary stroke-[2px]" : "")}
                    />
                    
                    {/* Upper sinuses */}
                    <path 
                      d="M85 95 C 95 105, 105 105, 115 95" 
                      strokeDasharray="2,1"
                      className={cn(selectedRegion === "upperSinuses" ? "stroke-primary stroke-[2px]" : "")}
                    />
                    
                    {/* Lower sinuses */}
                    <path 
                      d="M80 115 C 90 125, 110 125, 120 115" 
                      strokeDasharray="2,1"
                      className={cn(selectedRegion === "lowerSinuses" ? "stroke-primary stroke-[2px]" : "")}
                    />
                    
                    {/* Detail lines for pencil effect */}
                    <path d="M60 70 C 80 60, 120 60, 140 70" strokeLinecap="round" strokeDasharray="1,2" />
                    <path d="M70 100 C 85 110, 115 110, 130 100" strokeLinecap="round" strokeDasharray="1,2" />
                    <path d="M60 140 C 80 150, 120 150, 140 140" strokeLinecap="round" strokeDasharray="1,2" />
                  </g>
                </svg>
                <div className="absolute inset-0">
                  <div className="grid grid-cols-2 grid-rows-2 h-full gap-1 p-1">
                    {anteriorRegions.map((region) => (
                      <Popover key={region.id}>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="secondary" 
                            className={cn(
                              "bg-white/40 hover:bg-white/50 text-gray-900 transition-all",
                              selectedRegion === region.id && "bg-primary/70 text-white ring-2 ring-primary"
                            )}
                            onClick={() => handleRegionSelect(region.id)}
                          >
                            {region.name}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="bg-gray-800 text-white border-gray-700 w-60">
                          <p className="text-sm">{region.description}</p>
                        </PopoverContent>
                      </Popover>
                    ))}
                  </div>
                </div>
              </div>
            </div>
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
