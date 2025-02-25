
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

export default function LogPainIntensity() {
  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Pain Intensity Scale</h2>
          <div className="space-y-6">
            <Slider defaultValue={[5]} max={10} step={1} />
            <p className="text-white/60 text-sm">
              Move the slider to indicate your pain level from 0 (no pain) to 10 (worst pain)
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
