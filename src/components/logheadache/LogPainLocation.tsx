
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Skull } from "lucide-react";

type HeadRegion = {
  id: string;
  name: string;
  description: string;
  position: "anterior" | "posterior" | "both";
};

const headRegions: HeadRegion[] = [
  { 
    id: "frontLeft", 
    name: "Front Left", 
    description: "Left side of the forehead and temple",
    position: "anterior"
  },
  { 
    id: "frontRight", 
    name: "Front Right", 
    description: "Right side of the forehead and temple",
    position: "anterior"
  },
  { 
    id: "centerFront", 
    name: "Center Front", 
    description: "Central forehead",
    position: "anterior"
  },
  { 
    id: "lowerFace", 
    name: "Lower Face", 
    description: "Jaw and lower facial area",
    position: "anterior"
  },
  { 
    id: "backLower", 
    name: "Occipital (Back Lower)", 
    description: "Lower back of the head and neck",
    position: "posterior"
  },
  { 
    id: "backCenter", 
    name: "Parietal (Back Center)", 
    description: "Central back of the head",
    position: "posterior"
  },
  { 
    id: "backLeft", 
    name: "Left Temporal", 
    description: "Left side of the head",
    position: "posterior"
  },
  { 
    id: "backRight", 
    name: "Right Temporal", 
    description: "Right side of the head",
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
          
          <div className="relative mx-auto max-w-md">
            <div className="flex flex-col items-center">
              <Skull 
                className={`w-40 h-40 ${viewMode === "anterior" ? "text-cyan-400" : "text-cyan-600"}`} 
                strokeWidth={1.5}
              />
              <p className="text-gray-300 mt-2">
                {viewMode === "anterior" ? "Front View" : "Back View"}
              </p>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              {headRegions
                .filter(region => region.position === viewMode || region.position === "both")
                .map((region) => (
                  <Button 
                    key={region.id}
                    onClick={() => handleRegionSelect(region.id)}
                    variant="secondary"
                    className={`
                      bg-gray-700/40 hover:bg-gray-700/60 text-white text-left
                      ${selectedRegion === region.id ? "border-2 border-emerald-500" : "border border-gray-600"}
                    `}
                  >
                    <div>
                      <div className="font-medium">{region.name}</div>
                      <div className="text-xs text-gray-300">{region.description}</div>
                    </div>
                  </Button>
                ))}
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
              className={`
                bg-gray-700/40 hover:bg-gray-700/60 text-white
                ${painDistribution === "left" && "bg-primary/50 border border-primary"}
              `}
              onClick={() => setPainDistribution("left")}
            >
              Left Side
            </Button>
            <Button 
              variant="secondary" 
              className={`
                bg-gray-700/40 hover:bg-gray-700/60 text-white
                ${painDistribution === "both" && "bg-primary/50 border border-primary"}
              `}
              onClick={() => setPainDistribution("both")}
            >
              Both Sides
            </Button>
            <Button 
              variant="secondary" 
              className={`
                bg-gray-700/40 hover:bg-gray-700/60 text-white
                ${painDistribution === "right" && "bg-primary/50 border border-primary"}
              `}
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
