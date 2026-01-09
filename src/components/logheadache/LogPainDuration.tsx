import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useEpisode } from "@/contexts/EpisodeContext";

interface LogPainDurationProps {
  episodeId?: string | null;
}

export default function LogPainDuration({ episodeId }: LogPainDurationProps) {
  const [isOngoing, setIsOngoing] = useState(true);
  const [enableReminders, setEnableReminders] = useState(false);
  const [reminderInterval, setReminderInterval] = useState([30]);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [hours, setHours] = useState<string>("");
  const [minutes, setMinutes] = useState<string>("");
  const { updateEpisode, activeEpisode } = useEpisode();
  
  // Load existing data if available
  useEffect(() => {
    if (activeEpisode) {
      if (activeEpisode.start_time) {
        // Convert to local datetime format for input
        const startDate = new Date(activeEpisode.start_time);
        setStartTime(formatDateTimeLocal(startDate));
      }
      if (activeEpisode.end_time) {
        setIsOngoing(false);
        const endDate = new Date(activeEpisode.end_time);
        setEndTime(formatDateTimeLocal(endDate));
      }
      if (activeEpisode.duration_minutes) {
        const h = Math.floor(activeEpisode.duration_minutes / 60);
        const m = activeEpisode.duration_minutes % 60;
        setHours(h.toString());
        setMinutes(m.toString());
      }
    }
  }, [activeEpisode]);

  const formatDateTimeLocal = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };
  
  const handleReminderToggle = (checked: boolean) => {
    setEnableReminders(checked);
    if (checked) {
      toast.success("Reminders enabled. You'll be notified to update the end time.");
    }
  };

  const handleStartTimeChange = async (value: string) => {
    setStartTime(value);
    if (episodeId && value) {
      await updateEpisode(episodeId, { start_time: new Date(value).toISOString() });
    }
  };

  const handleEndTimeChange = async (value: string) => {
    setEndTime(value);
    if (episodeId && value) {
      await updateEpisode(episodeId, { end_time: new Date(value).toISOString() });
      // Calculate duration if both times are set
      if (startTime) {
        const start = new Date(startTime);
        const end = new Date(value);
        const durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
        if (durationMinutes > 0) {
          await updateEpisode(episodeId, { duration_minutes: durationMinutes });
        }
      }
    }
  };

  const handleDurationChange = async (h: string, m: string) => {
    const hoursNum = parseInt(h) || 0;
    const minutesNum = parseInt(m) || 0;
    const totalMinutes = hoursNum * 60 + minutesNum;
    
    if (episodeId && totalMinutes > 0) {
      await updateEpisode(episodeId, { duration_minutes: totalMinutes });
    }
  };

  const handleOngoingToggle = async (checked: boolean) => {
    setIsOngoing(checked);
    if (checked && episodeId) {
      // Clear end time if marking as ongoing
      await updateEpisode(episodeId, { end_time: null });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-white">Pain Duration</h2>
            <div className="flex items-center gap-2">
              <Label htmlFor="ongoing" className="text-gray-400">Still Ongoing</Label>
              <Switch
                id="ongoing"
                checked={isOngoing}
                onCheckedChange={handleOngoingToggle}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-400">Start Time</Label>
              <Input 
                type="datetime-local"
                className="mt-1 bg-gray-700/40 border-gray-700 text-white"
                value={startTime}
                onChange={(e) => handleStartTimeChange(e.target.value)}
              />
            </div>

            {!isOngoing && (
              <div>
                <Label className="text-gray-400">End Time</Label>
                <Input 
                  type="datetime-local"
                  className="mt-1 bg-gray-700/40 border-gray-700 text-white"
                  value={endTime}
                  onChange={(e) => handleEndTimeChange(e.target.value)}
                />
              </div>
            )}

            {!isOngoing && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400">Duration (Hours)</Label>
                  <Input 
                    type="number" 
                    min="0"
                    className="mt-1 bg-gray-700/40 border-gray-700 text-white"
                    value={hours}
                    onChange={(e) => {
                      setHours(e.target.value);
                      handleDurationChange(e.target.value, minutes);
                    }}
                  />
                </div>
                <div>
                  <Label className="text-gray-400">Minutes</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    max="59"
                    className="mt-1 bg-gray-700/40 border-gray-700 text-white"
                    value={minutes}
                    onChange={(e) => {
                      setMinutes(e.target.value);
                      handleDurationChange(hours, e.target.value);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {isOngoing && (
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
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
                <Label className="text-gray-400">Reminder Frequency (minutes)</Label>
                <Slider
                  value={reminderInterval}
                  onValueChange={setReminderInterval}
                  min={15}
                  max={120}
                  step={15}
                  className="py-4"
                />
                <div className="flex justify-between text-sm text-gray-400">
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
