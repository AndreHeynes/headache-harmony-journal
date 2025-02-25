import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function LogPainLocation() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10">
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-medium text-white">Head Region</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-square">
                <svg viewBox="0 0 200 200" className="w-full h-full rounded-lg bg-black/40">
                  {/* Posterior view of skull */}
                  <path
                    d="M100 20 C 60 20, 30 60, 30 100 C 30 140, 60 180, 100 180 C 140 180, 170 140, 170 100 C 170 60, 140 20, 100 20"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                  />
                  {/* Occipital bone */}
                  <path
                    d="M60 100 C 60 140, 80 160, 100 160 C 120 160, 140 140, 140 100"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                  />
                  {/* Parietal bones */}
                  <path
                    d="M60 100 C 60 60, 80 40, 100 40 C 120 40, 140 60, 140 100"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                  />
                </svg>
                <div className="absolute inset-0">
                  <div className="grid grid-cols-2 grid-rows-2 h-full gap-1 p-1">
                    <Button variant="secondary" className="bg-white/50 hover:bg-white/60 text-gray-900">Crown</Button>
                    <Button variant="secondary" className="bg-white/50 hover:bg-white/60 text-gray-900">Temple</Button>
                    <Button variant="secondary" className="bg-white/50 hover:bg-white/60 text-gray-900">Base</Button>
                    <Button variant="secondary" className="bg-white/50 hover:bg-white/60 text-gray-900">Bump</Button>
                  </div>
                </div>
              </div>
              {/* Front view remains the same */}
              <div className="relative aspect-square">
                <svg viewBox="0 0 200 200" className="w-full h-full rounded-lg bg-black/40">
                  {/* Simple front view skull outline */}
                  <path
                    d="M100 20 C 60 20, 30 60, 30 120 L 50 160 L 150 160 L 170 120 C 170 60, 140 20, 100 20"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                  />
                  {/* Eyes */}
                  <circle cx="70" cy="80" r="15" fill="none" stroke="white" strokeWidth="2" />
                  <circle cx="130" cy="80" r="15" fill="none" stroke="white" strokeWidth="2" />
                </svg>
                <div className="absolute inset-0">
                  <div className="grid grid-cols-2 grid-rows-2 h-full gap-1 p-1">
                    <Button variant="secondary" className="bg-white/50 hover:bg-white/60 text-gray-900">Forehead</Button>
                    <Button variant="secondary" className="bg-white/50 hover:bg-white/60 text-gray-900">Eyes</Button>
                    <Button variant="secondary" className="bg-white/50 hover:bg-white/60 text-gray-900">Upper Sinuses</Button>
                    <Button variant="secondary" className="bg-white/50 hover:bg-white/60 text-gray-900">Lower Sinuses</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-medium text-white">Pain Distribution</h2>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="secondary" className="bg-white/5 hover:bg-white/10 text-white">Left Side</Button>
              <Button variant="secondary" className="bg-white/5 hover:bg-white/10 text-white">Both Sides</Button>
              <Button variant="secondary" className="bg-white/5 hover:bg-white/10 text-white">Right Side</Button>
            </div>
          </div>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-medium text-white">Distribution Pattern</h2>
            <RadioGroup defaultValue="medial">
              <div className="space-y-3">
                <Label className="flex items-center p-3 rounded-lg border border-white/10 bg-white/5">
                  <RadioGroupItem value="medial" className="text-primary" />
                  <span className="ml-3 text-white">Medial (inner)</span>
                </Label>
                <Label className="flex items-center p-3 rounded-lg border border-white/10 bg-white/5">
                  <RadioGroupItem value="lateral" className="text-primary" />
                  <span className="ml-3 text-white">Lateral (outer)</span>
                </Label>
                <Label className="flex items-center p-3 rounded-lg border border-white/10 bg-white/5">
                  <RadioGroupItem value="both" className="text-primary" />
                  <span className="ml-3 text-white">Both (broad)</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">Does Pain spread?</h2>
              <Switch />
            </div>

            <RadioGroup defaultValue="remain">
              <div className="space-y-3">
                <Label className="flex items-center p-3 rounded-lg border border-white/10 bg-white/5">
                  <RadioGroupItem value="remain" className="text-primary" />
                  <span className="ml-3 text-white">Remain on starting side</span>
                </Label>
                <Label className="flex items-center p-3 rounded-lg border border-white/10 bg-white/5">
                  <RadioGroupItem value="change" className="text-primary" />
                  <span className="ml-3 text-white">Changes to opposite side</span>
                </Label>
                <Label className="flex items-center p-3 rounded-lg border border-white/10 bg-white/5">
                  <RadioGroupItem value="return" className="text-primary" />
                  <span className="ml-3 text-white">Changes side and returns</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </Card>
    </div>
  );
}
