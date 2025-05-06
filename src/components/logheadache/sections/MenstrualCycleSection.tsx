
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { addDays, format, differenceInDays } from "date-fns";
import { useTestContext } from "@/contexts/TestContext";

export interface MenstrualCycleData {
  phase: string;
  lastPeriodStartDate: Date | undefined;
  cycleLength: number;
  currentDayOfCycle: number | undefined;
}

export function MenstrualCycleSection() {
  const [lastPeriodStartDate, setLastPeriodStartDate] = useState<Date | undefined>(undefined);
  const [averageCycleLength, setAverageCycleLength] = useState<number>(28);
  const { premiumFeatures } = useTestContext();
  
  // Check if menstrual cycle tracking is enabled in premium features
  const isEnabled = premiumFeatures.menstrual_tracking;

  // Calculate current phase based on last period and cycle length
  const calculatePhase = (): { phase: string; dayOfCycle: number | undefined } => {
    if (!lastPeriodStartDate) return { phase: "unknown", dayOfCycle: undefined };
    
    const today = new Date();
    const daysSinceLastPeriod = differenceInDays(today, lastPeriodStartDate);
    const currentDayInCycle = (daysSinceLastPeriod % averageCycleLength) + 1;
    
    // Simple phase calculation (would be more nuanced in a real app)
    // Menstrual: days 1-5
    // Follicular: days 6-10
    // Ovulation: days 11-14
    // Luteal: days 15+
    
    if (currentDayInCycle <= 5) {
      return { phase: "menstrual", dayOfCycle: currentDayInCycle };
    } else if (currentDayInCycle <= 10) {
      return { phase: "follicular", dayOfCycle: currentDayInCycle };
    } else if (currentDayInCycle <= 14) {
      return { phase: "ovulation", dayOfCycle: currentDayInCycle };
    } else {
      return { phase: "luteal", dayOfCycle: currentDayInCycle };
    }
  };
  
  const { phase, dayOfCycle } = calculatePhase();

  // Next expected period date
  const getNextPeriodDate = (): string => {
    if (!lastPeriodStartDate) return "Unknown";
    const nextPeriodDate = addDays(lastPeriodStartDate, averageCycleLength);
    return format(nextPeriodDate, "PPP");
  };

  if (!isEnabled) {
    return null; // Don't render if not enabled in premium features
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mb-4">
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-rose-400" />
          <h2 className="text-lg font-medium text-white">Menstrual Cycle Tracking</h2>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-gray-300">Last period start date</Label>
              <DatePicker
                date={lastPeriodStartDate}
                onDateChange={setLastPeriodStartDate}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Average cycle length</Label>
              <Select 
                value={averageCycleLength.toString()}
                onValueChange={(value) => setAverageCycleLength(parseInt(value))}
              >
                <SelectTrigger className="bg-gray-700/40 border-gray-700 text-white">
                  <SelectValue placeholder="Select a cycle length" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => i + 23).map((days) => (
                    <SelectItem key={days} value={days.toString()}>
                      {days} days
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-lg bg-gray-700/30 p-4 border border-gray-600">
            <div className="grid grid-cols-2 gap-y-2">
              <div className="text-gray-300">Current phase:</div>
              <div className="text-rose-300 font-medium capitalize">{phase}</div>
              
              <div className="text-gray-300">Day in cycle:</div>
              <div className="text-white">{dayOfCycle || "Unknown"}</div>
              
              <div className="text-gray-300">Next period:</div>
              <div className="text-white">{getNextPeriodDate()}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
