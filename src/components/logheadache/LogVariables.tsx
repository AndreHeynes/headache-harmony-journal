
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function LogVariables() {
  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Self-Determined Variables</h2>
          <div className="space-y-6">
            <div>
              <Label className="text-white/60">Stress Level</Label>
              <Slider defaultValue={[5]} max={10} step={1} className="mt-2" />
            </div>
            <div>
              <Label className="text-white/60">Hours of Sleep</Label>
              <Input type="number" min="0" max="24" className="mt-1 bg-white/5 border-white/10 text-white" />
            </div>
            <div>
              <Label className="text-white/60">Water Intake (glasses)</Label>
              <Input type="number" min="0" className="mt-1 bg-white/5 border-white/10 text-white" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
