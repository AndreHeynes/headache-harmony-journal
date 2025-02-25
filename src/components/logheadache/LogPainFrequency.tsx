
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function LogPainFrequency() {
  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Pain Frequency</h2>
          <RadioGroup defaultValue="occasional">
            <div className="space-y-3">
              <Label className="flex items-center p-3 rounded-lg border border-white/10 bg-white/5">
                <RadioGroupItem value="occasional" className="text-primary" />
                <span className="ml-3 text-white">Occasional (1-2 times per month)</span>
              </Label>
              <Label className="flex items-center p-3 rounded-lg border border-white/10 bg-white/5">
                <RadioGroupItem value="frequent" className="text-primary" />
                <span className="ml-3 text-white">Frequent (1-2 times per week)</span>
              </Label>
              <Label className="flex items-center p-3 rounded-lg border border-white/10 bg-white/5">
                <RadioGroupItem value="chronic" className="text-primary" />
                <span className="ml-3 text-white">Chronic (3+ times per week)</span>
              </Label>
              <Label className="flex items-center p-3 rounded-lg border border-white/10 bg-white/5">
                <RadioGroupItem value="daily" className="text-primary" />
                <span className="ml-3 text-white">Daily</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </Card>
    </div>
  );
}
