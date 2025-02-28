
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function NotificationsCard() {
  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Notifications</h3>
          <Switch />
        </div>

        <div className="space-y-6">
          <div>
            <Label className="text-gray-300">Daily Check-in Reminders</Label>
            <div className="mt-2">
              <Slider
                defaultValue={[4]}
                max={10}
                step={1}
                className="w-full"
              />
              <p className="mt-1 text-sm text-gray-400">4 times per day</p>
            </div>
          </div>

          <div>
            <Label className="text-gray-300">Episode Duration Tracking</Label>
            <div className="mt-2">
              <Slider
                defaultValue={[60]}
                max={120}
                step={5}
                className="w-full"
              />
              <p className="mt-1 text-sm text-gray-400">60 minutes</p>
            </div>
          </div>

          <div>
            <Label className="text-gray-300">Quiet Hours</Label>
            <div className="flex gap-4 mt-2">
              <Select>
                <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white">
                  <SelectValue placeholder="Start time" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="22">22:00</SelectItem>
                  <SelectItem value="23">23:00</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white">
                  <SelectValue placeholder="End time" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="6">06:00</SelectItem>
                  <SelectItem value="7">07:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Notification Style</Label>
            <div className="space-y-2">
              {[
                "Sound & Vibration",
                "Sound Only",
                "Vibration Only",
                "Silent"
              ].map((option) => (
                <div key={option} className="flex items-center justify-between p-3 bg-gray-700/30 border border-gray-600 rounded-lg">
                  <span className="text-white">{option}</span>
                  <Switch />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
