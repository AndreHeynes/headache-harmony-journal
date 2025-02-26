
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export default function LogPainDuration() {
  const [isOngoing, setIsOngoing] = useState(true);
  const [enableReminders, setEnableReminders] = useState(false);
  const [reminderInterval, setReminderInterval] = useState([30]);
  
  const handleReminderToggle = (checked: boolean) => {
    setEnableReminders(checked);
    if (checked) {
      toast.success("Reminders enabled. You'll be notified to update the end time.");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10">
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-white">Pain Duration</h2>
            <div className="flex items-center gap-2">
              <Label htmlFor="ongoing" className="text-white/60">Still Ongoing</Label>
              <Switch
                id="ongoing"
                checked={isOngoing}
                onCheckedChange={setIsOngoing}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-white/60">Start Time</Label>
              <Input 
                type="datetime-local"
                className="mt-1 bg-white/5 border-white/10 text-white"
              />
            </div>

            {!isOngoing && (
              <div>
                <Label className="text-white/60">End Time</Label>
                <Input 
                  type="datetime-local"
                  className="mt-1 bg-white/5 border-white/10 text-white"
                />
              </div>
            )}

            {!isOngoing && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/60">Duration (Hours)</Label>
                  <Input 
                    type="number" 
                    min="0"
                    className="mt-1 bg-white/5 border-white/10 text-white" 
                  />
                </div>
                <div>
                  <Label className="text-white/60">Minutes</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    max="59"
                    className="mt-1 bg-white/5 border-white/10 text-white" 
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {isOngoing && (
        <Card className="bg-white/5 border-white/10">
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-white">Reminder Settings</h2>
              <Switch
                id="enableReminders"
                checked={enableReminders}
                onCheckedChange={handleReminderToggle}
              />
            </div>

            {enableReminders && (
              <div className="space-y-4">
                <Label className="text-white/60">Reminder Frequency (minutes)</Label>
                <Slider
                  value={reminderInterval}
                  onValueChange={setReminderInterval}
                  min={15}
                  max={120}
                  step={15}
                  className="py-4"
                />
                <div className="flex justify-between text-sm text-white/60">
                  <span>15m</span>
                  <span className="text-primary">Every {reminderInterval[0]} minutes</span>
                  <span>120m</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
