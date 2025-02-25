
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function LogTreatment() {
  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Treatment Log</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-white/60">Medications Taken</Label>
              <div className="mt-2 space-y-3">
                {[
                  "Over-the-counter pain reliever",
                  "Prescription medication",
                  "Anti-nausea medication"
                ].map((medication) => (
                  <Label key={medication} className="flex items-center p-3 rounded-lg border border-white/10 bg-white/5">
                    <Checkbox className="border-primary data-[state=checked]:bg-primary" />
                    <span className="ml-3 text-white">{medication}</span>
                  </Label>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-white/60">Other Treatments</Label>
              <div className="mt-2 space-y-3">
                {[
                  "Rest in dark room",
                  "Cold compress",
                  "Hot compress",
                  "Hydration",
                  "Caffeine"
                ].map((treatment) => (
                  <Label key={treatment} className="flex items-center p-3 rounded-lg border border-white/10 bg-white/5">
                    <Checkbox className="border-primary data-[state=checked]:bg-primary" />
                    <span className="ml-3 text-white">{treatment}</span>
                  </Label>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-white/60">Notes</Label>
              <Textarea 
                className="mt-2 bg-white/5 border-white/10 text-white" 
                placeholder="Add any additional notes about treatment effectiveness..."
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
