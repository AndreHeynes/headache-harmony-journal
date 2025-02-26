
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LogVariables() {
  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10">
        <div className="p-4 space-y-6">
          <h2 className="text-lg font-medium text-white">Self-Determined Variables</h2>
          
          {/* Basic Variables */}
          <div className="space-y-6">
            <div>
              <Label className="text-white/60">Stress Level</Label>
              <Slider defaultValue={[5]} max={10} step={1} className="mt-2" />
            </div>
            
            <div>
              <Label className="text-white/60">Sleep Quality</Label>
              <Select>
                <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select sleep quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
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

          {/* Environmental Conditions */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-base font-medium text-white">Environmental Conditions</h3>
            
            <div>
              <Label className="text-white/60">Light Sensitivity</Label>
              <Select>
                <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select light condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bright">Bright Light</SelectItem>
                  <SelectItem value="normal">Normal Light</SelectItem>
                  <SelectItem value="dim">Dim Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white/60">Noise Level</Label>
              <Select>
                <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select noise level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="loud">Loud</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="quiet">Quiet</SelectItem>
                  <SelectItem value="silent">Silent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white/60">Weather Conditions</Label>
              <Select>
                <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select weather condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunny">Sunny</SelectItem>
                  <SelectItem value="cloudy">Cloudy</SelectItem>
                  <SelectItem value="rainy">Rainy</SelectItem>
                  <SelectItem value="stormy">Stormy</SelectItem>
                  <SelectItem value="humid">Humid</SelectItem>
                  <SelectItem value="dry">Dry</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Menstrual Cycle Tracking */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-white">Menstrual Cycle</h3>
              <Switch />
            </div>

            <div>
              <Label className="text-white/60">Cycle Phase</Label>
              <Select>
                <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select cycle phase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="menstrual">Menstrual Phase</SelectItem>
                  <SelectItem value="follicular">Follicular Phase</SelectItem>
                  <SelectItem value="ovulation">Ovulation Phase</SelectItem>
                  <SelectItem value="luteal">Luteal Phase</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white/60">Day of Cycle</Label>
              <Input 
                type="number" 
                min="1" 
                max="31" 
                className="mt-1 bg-white/5 border-white/10 text-white" 
                placeholder="Enter day of cycle"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
