
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useQuery } from '@tanstack/react-query';
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WeatherData {
  condition: string;
  temperature: number;
  humidity: number;
}

export default function LogVariables() {
  // Basic Variables State
  const [stressLevel, setStressLevel] = useState<number>(5);
  const [sleepQuality, setSleepQuality] = useState<string>("");
  const [sleepHours, setSleepHours] = useState<number>(8);
  const [waterIntake, setWaterIntake] = useState<number>(0);

  // Environmental Conditions State
  const [lightSensitivity, setLightSensitivity] = useState<string>("");
  const [noiseLevel, setNoiseLevel] = useState<string>("");
  const [weatherCondition, setWeatherCondition] = useState<string>("");

  // Menstrual Cycle State
  const [cycleTrackingEnabled, setCycleTrackingEnabled] = useState<boolean>(false);
  const [cyclePhase, setCyclePhase] = useState<string>("");
  const [cycleDay, setCycleDay] = useState<number>(1);

  // Weather API Integration
  const { data: weatherData } = useQuery({
    queryKey: ['weather'],
    queryFn: async (): Promise<WeatherData> => {
      try {
        // Note: In a real app, you'd want to handle location permission and use a real weather API
        // This is just a mock implementation
        return {
          condition: 'sunny',
          temperature: 22,
          humidity: 45
        };
      } catch (error) {
        // Fixed toast usage to match sonner's API
        toast("Weather data unavailable", {
          description: "Using manual weather input instead"
        });
        throw error;
      }
    },
    enabled: true, // Enable the query by default
  });

  // Fixed: Changed useState to useEffect for handling weather data updates
  useEffect(() => {
    if (weatherData?.condition) {
      setWeatherCondition(weatherData.condition);
    }
  }, [weatherData]);

  // Handle form submission
  const handleSubmit = () => {
    const data = {
      basicVariables: {
        stressLevel,
        sleepQuality,
        sleepHours,
        waterIntake,
      },
      environmentalConditions: {
        lightSensitivity,
        noiseLevel,
        weatherCondition,
      },
      menstrualCycle: cycleTrackingEnabled ? {
        phase: cyclePhase,
        day: cycleDay,
      } : null,
    };

    // This data would be saved to your backend
    console.log('Submitting variables:', data);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10">
        <div className="p-4 space-y-6">
          <h2 className="text-lg font-medium text-white">Self-Determined Variables</h2>
          
          {/* Basic Variables */}
          <div className="space-y-6">
            <div>
              <Label className="text-white/60">Stress Level</Label>
              <Slider 
                defaultValue={[stressLevel]} 
                max={10} 
                step={1} 
                className="mt-2"
                onValueChange={(value) => setStressLevel(value[0])} 
              />
            </div>
            
            <div>
              <Label className="text-white/60">Sleep Quality</Label>
              <Select value={sleepQuality} onValueChange={setSleepQuality}>
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
              <Input 
                type="number" 
                min="0" 
                max="24" 
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
                className="mt-1 bg-white/5 border-white/10 text-white" 
              />
            </div>

            <div>
              <Label className="text-white/60">Water Intake (glasses)</Label>
              <Input 
                type="number" 
                min="0" 
                value={waterIntake}
                onChange={(e) => setWaterIntake(Number(e.target.value))}
                className="mt-1 bg-white/5 border-white/10 text-white" 
              />
            </div>
          </div>

          {/* Environmental Conditions */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-base font-medium text-white">Environmental Conditions</h3>
            
            <div>
              <Label className="text-white/60">Light Sensitivity</Label>
              <Select value={lightSensitivity} onValueChange={setLightSensitivity}>
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
              <Select value={noiseLevel} onValueChange={setNoiseLevel}>
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
              <Select value={weatherCondition} onValueChange={setWeatherCondition}>
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
              <Switch 
                checked={cycleTrackingEnabled}
                onCheckedChange={setCycleTrackingEnabled}
              />
            </div>

            {cycleTrackingEnabled && (
              <>
                <div>
                  <Label className="text-white/60">Cycle Phase</Label>
                  <Select value={cyclePhase} onValueChange={setCyclePhase}>
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
                    value={cycleDay}
                    onChange={(e) => setCycleDay(Number(e.target.value))}
                    className="mt-1 bg-white/5 border-white/10 text-white" 
                    placeholder="Enter day of cycle"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
