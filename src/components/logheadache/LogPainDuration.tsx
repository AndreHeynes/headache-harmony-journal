
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LogPainDuration() {
  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Pain Duration</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white/60">Hours</Label>
              <Input type="number" min="0" className="mt-1 bg-white/5 border-white/10 text-white" />
            </div>
            <div>
              <Label className="text-white/60">Minutes</Label>
              <Input type="number" min="0" max="59" className="mt-1 bg-white/5 border-white/10 text-white" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
