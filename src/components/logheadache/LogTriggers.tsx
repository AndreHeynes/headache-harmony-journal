import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { StressTriggersSection } from "./sections/StressTriggersSection";
import { PremiumVariablesSection } from "./sections/PremiumVariablesSection";
import { WeatherSection } from "./sections/WeatherSection";
import { MenstrualCycleSection } from "./sections/MenstrualCycleSection";
import { useEpisode } from "@/contexts/EpisodeContext";
import { useLocations } from "@/contexts/LocationContext";
import { LocationTabs } from "./LocationTabs";
import { PatternScreening } from "./screening/PatternScreening";

interface LogTriggersProps {
  episodeId?: string | null;
}

interface Activity {
  type: string;
  duration: string;
  hoursBefore: string;
}

export default function LogTriggers({ episodeId }: LogTriggersProps) {
  const [foodItems, setFoodItems] = useState([{ food: "", hours: "" }]);
  const [beverages, setBeverages] = useState([{ beverage: "", hours: "" }]);
  const [activities, setActivities] = useState<Activity[]>([{ type: "", duration: "", hoursBefore: "" }]);
  const [triggers, setTriggers] = useState<string[]>([]);
  const { updateEpisode, activeEpisode } = useEpisode();
  const { locations, activeLocationId, activeLocation, updateLocation } = useLocations();

  const hasMultipleLocations = locations.length > 1;

  // Load existing triggers from location or episode
  useEffect(() => {
    const source = hasMultipleLocations && activeLocation
      ? activeLocation.triggers
      : activeEpisode?.triggers;
    setTriggers(source || []);
  }, [activeEpisode, activeLocation, activeLocationId, hasMultipleLocations]);

  const saveTriggers = async (newTriggers: string[]) => {
    setTriggers(newTriggers);
    if (hasMultipleLocations && activeLocationId) {
      await updateLocation(activeLocationId, { triggers: newTriggers });
    } else if (episodeId) {
      await updateEpisode(episodeId, { triggers: newTriggers });
    }
  };

  const addNewFoodItem = () => setFoodItems([...foodItems, { food: "", hours: "" }]);
  const addNewBeverage = () => setBeverages([...beverages, { beverage: "", hours: "" }]);
  const addNewActivity = () => setActivities([...activities, { type: "", duration: "", hoursBefore: "" }]);

  const handleFoodChange = async (index: number, field: 'food' | 'hours', value: string) => {
    const updated = [...foodItems];
    updated[index][field] = value;
    setFoodItems(updated);
    const foodTriggers = updated.filter(item => item.food.trim())
      .map(item => `Food: ${item.food}${item.hours ? ` (${item.hours}h before)` : ''}`);
    const otherTriggers = triggers.filter(t => !t.startsWith('Food:'));
    await saveTriggers([...otherTriggers, ...foodTriggers]);
  };

  const handleBeverageChange = async (index: number, field: 'beverage' | 'hours', value: string) => {
    const updated = [...beverages];
    updated[index][field] = value;
    setBeverages(updated);
    const beverageTriggers = updated.filter(item => item.beverage.trim())
      .map(item => `Beverage: ${item.beverage}${item.hours ? ` (${item.hours}h before)` : ''}`);
    const otherTriggers = triggers.filter(t => !t.startsWith('Beverage:'));
    await saveTriggers([...otherTriggers, ...beverageTriggers]);
  };

  const handleActivityChange = async (index: number, field: 'type' | 'duration' | 'hoursBefore', value: string) => {
    const updated = [...activities];
    updated[index][field] = value;
    setActivities(updated);
    const activityTriggers = updated.filter(item => item.type.trim())
      .map(item => {
        let triggerStr = `Activity: ${item.type}`;
        if (item.hoursBefore) triggerStr += ` (${item.hoursBefore}h before)`;
        if (item.duration) triggerStr += ` [${item.duration} min]`;
        return triggerStr;
      });
    const otherTriggers = triggers.filter(t => !t.startsWith('Activity:'));
    await saveTriggers([...otherTriggers, ...activityTriggers]);
  };

  const handleWeatherCapture = async (weatherTrigger: string) => {
    const otherTriggers = triggers.filter(t => !t.startsWith('Weather:'));
    await saveTriggers([...otherTriggers, weatherTrigger]);
  };

  const handleCycleDataCapture = async (cycleTrigger: string) => {
    const otherTriggers = triggers.filter(t => !t.startsWith('Cycle Phase:'));
    await saveTriggers([...otherTriggers, cycleTrigger]);
  };

  const handleStressChange = async (stressTriggers: string[]) => {
    const otherTriggers = triggers.filter(t => !t.startsWith('Stress:'));
    await saveTriggers([...otherTriggers, ...stressTriggers]);
  };

  return (
    <div className="space-y-6">
      <LocationTabs />

      <PatternScreening />

      <WeatherSection onWeatherCapture={handleWeatherCapture} />
      <MenstrualCycleSection onCycleDataCapture={handleCycleDataCapture} />
      
      <Card className="bg-card border-border">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-foreground">
            Food Triggers
            {hasMultipleLocations && activeLocation && (
              <span className="text-sm font-normal text-primary ml-2">— {activeLocation.location_name}</span>
            )}
          </h2>
          <div className="space-y-3">
            {foodItems.map((item, index) => (
              <div key={index} className="grid grid-cols-2 gap-3">
                <Input placeholder="Food item" className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                  value={item.food} onChange={(e) => handleFoodChange(index, 'food', e.target.value)} />
                <Input placeholder="Hours before" type="number" className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                  value={item.hours} onChange={(e) => handleFoodChange(index, 'hours', e.target.value)} />
              </div>
            ))}
            <Button variant="ghost" className="w-full border border-dashed border-border hover:bg-muted/50 text-muted-foreground" onClick={addNewFoodItem}>
              <Plus className="mr-2 h-4 w-4" /> Add Food Item
            </Button>
          </div>
        </div>
      </Card>
      
      <Card className="bg-card border-border">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-foreground">Beverages</h2>
          <div className="space-y-3">
            {beverages.map((item, index) => (
              <div key={index} className="grid grid-cols-2 gap-3">
                <Input placeholder="Beverage" className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                  value={item.beverage} onChange={(e) => handleBeverageChange(index, 'beverage', e.target.value)} />
                <Input placeholder="Hours before" type="number" className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                  value={item.hours} onChange={(e) => handleBeverageChange(index, 'hours', e.target.value)} />
              </div>
            ))}
            <Button variant="ghost" className="w-full border border-dashed border-border hover:bg-muted/50 text-muted-foreground" onClick={addNewBeverage}>
              <Plus className="mr-2 h-4 w-4" /> Add Beverage
            </Button>
          </div>
        </div>
      </Card>
      
      <StressTriggersSection onStressChange={handleStressChange} initialStress={triggers.filter(t => t.startsWith('Stress:'))} />
      
      <Card className="bg-card border-border">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-foreground">Activities</h2>
          <div className="space-y-3">
            {activities.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Activity type" className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                    value={item.type} onChange={(e) => handleActivityChange(index, 'type', e.target.value)} />
                  <Input placeholder="Hours before" type="number" className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                    value={item.hoursBefore} onChange={(e) => handleActivityChange(index, 'hoursBefore', e.target.value)} />
                </div>
                <div className="relative">
                  <Input placeholder="Duration (optional)" type="number" className="bg-background border-border text-foreground placeholder:text-muted-foreground pr-12"
                    value={item.duration} onChange={(e) => handleActivityChange(index, 'duration', e.target.value)} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">min</span>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full border border-dashed border-border hover:bg-muted/50 text-muted-foreground" onClick={addNewActivity}>
              <Plus className="mr-2 h-4 w-4" /> Add Activity
            </Button>
          </div>
        </div>
      </Card>
      
      <PremiumVariablesSection />
    </div>
  );
}
