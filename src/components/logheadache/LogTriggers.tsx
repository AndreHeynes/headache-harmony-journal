import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { FoodTriggersSection } from "./sections/FoodTriggersSection";
import { BeveragesSection } from "./sections/BeveragesSection";
import { StressTriggersSection } from "./sections/StressTriggersSection";
import { ActivitiesSection } from "./sections/ActivitiesSection";
import { PremiumVariablesSection } from "./sections/PremiumVariablesSection";
import { WeatherSection } from "./sections/WeatherSection";
import { MenstrualCycleSection } from "./sections/MenstrualCycleSection";
import { useEpisode } from "@/contexts/EpisodeContext";

interface LogTriggersProps {
  episodeId?: string | null;
}

export default function LogTriggers({ episodeId }: LogTriggersProps) {
  const [foodItems, setFoodItems] = useState([{ food: "", hours: "" }]);
  const [beverages, setBeverages] = useState([{ beverage: "", hours: "" }]);
  const [activities, setActivities] = useState([{ type: "", duration: "" }]);
  const [triggers, setTriggers] = useState<string[]>([]);
  const { updateEpisode, activeEpisode } = useEpisode();

  // Load existing triggers
  useEffect(() => {
    if (activeEpisode?.triggers) {
      setTriggers(activeEpisode.triggers);
    }
  }, [activeEpisode]);

  const addNewItem = (list: any[], setList: (items: any[]) => void) => {
    setList([...list, { food: "", hours: "", beverage: "", type: "", duration: "" }]);
  };

  const saveTriggers = async (newTriggers: string[]) => {
    setTriggers(newTriggers);
    if (episodeId) {
      await updateEpisode(episodeId, { triggers: newTriggers });
    }
  };

  const handleFoodChange = async (index: number, field: 'food' | 'hours', value: string) => {
    const updated = [...foodItems];
    updated[index][field] = value;
    setFoodItems(updated);
    
    // Update triggers with food items
    const foodTriggers = updated
      .filter(item => item.food.trim())
      .map(item => `Food: ${item.food}${item.hours ? ` (${item.hours}h before)` : ''}`);
    
    const otherTriggers = triggers.filter(t => !t.startsWith('Food:'));
    await saveTriggers([...otherTriggers, ...foodTriggers]);
  };

  const handleBeverageChange = async (index: number, field: 'beverage' | 'hours', value: string) => {
    const updated = [...beverages];
    updated[index][field] = value;
    setBeverages(updated);
    
    // Update triggers with beverages
    const beverageTriggers = updated
      .filter(item => item.beverage.trim())
      .map(item => `Beverage: ${item.beverage}${item.hours ? ` (${item.hours}h before)` : ''}`);
    
    const otherTriggers = triggers.filter(t => !t.startsWith('Beverage:'));
    await saveTriggers([...otherTriggers, ...beverageTriggers]);
  };

  const handleActivityChange = async (index: number, field: 'type' | 'duration', value: string) => {
    const updated = [...activities];
    updated[index][field] = value;
    setActivities(updated);
    
    // Update triggers with activities
    const activityTriggers = updated
      .filter(item => item.type.trim())
      .map(item => `Activity: ${item.type}${item.duration ? ` (${item.duration})` : ''}`);
    
    const otherTriggers = triggers.filter(t => !t.startsWith('Activity:'));
    await saveTriggers([...otherTriggers, ...activityTriggers]);
  };

  return (
    <div className="space-y-6">
      {/* Weather integration - appears at the top as it's environmental data */}
      <WeatherSection />
      
      {/* Menstrual cycle tracking - appears near the top as it's a potential primary trigger */}
      <MenstrualCycleSection />
      
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Food Triggers</h2>
          <div className="space-y-3">
            {foodItems.map((item, index) => (
              <div key={index} className="grid grid-cols-2 gap-3">
                <div>
                  <Input 
                    placeholder="Food item" 
                    className="bg-gray-700/40 border-gray-700 text-white placeholder:text-gray-500"
                    value={item.food}
                    onChange={(e) => handleFoodChange(index, 'food', e.target.value)}
                  />
                </div>
                <div>
                  <Input 
                    placeholder="Hours before"
                    type="number"
                    className="bg-gray-700/40 border-gray-700 text-white placeholder:text-gray-500"
                    value={item.hours}
                    onChange={(e) => handleFoodChange(index, 'hours', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <Button 
              variant="ghost" 
              className="w-full border border-dashed border-gray-700 hover:bg-gray-700/20 text-gray-400"
              onClick={() => addNewItem(foodItems, setFoodItems)}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Food Item
            </Button>
          </div>
        </div>
      </Card>
      
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Beverages</h2>
          <div className="space-y-3">
            {beverages.map((item, index) => (
              <div key={index} className="grid grid-cols-2 gap-3">
                <div>
                  <Input 
                    placeholder="Beverage" 
                    className="bg-gray-700/40 border-gray-700 text-white placeholder:text-gray-500"
                    value={item.beverage}
                    onChange={(e) => handleBeverageChange(index, 'beverage', e.target.value)}
                  />
                </div>
                <div>
                  <Input 
                    placeholder="Hours before"
                    type="number"
                    className="bg-gray-700/40 border-gray-700 text-white placeholder:text-gray-500"
                    value={item.hours}
                    onChange={(e) => handleBeverageChange(index, 'hours', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <Button 
              variant="ghost" 
              className="w-full border border-dashed border-gray-700 hover:bg-gray-700/20 text-gray-400"
              onClick={() => addNewItem(beverages, setBeverages)}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Beverage
            </Button>
          </div>
        </div>
      </Card>
      
      <StressTriggersSection />
      
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Activities</h2>
          <div className="space-y-3">
            {activities.map((item, index) => (
              <div key={index} className="grid grid-cols-2 gap-3">
                <div>
                  <Input 
                    placeholder="Activity type" 
                    className="bg-gray-700/40 border-gray-700 text-white placeholder:text-gray-500"
                    value={item.type}
                    onChange={(e) => handleActivityChange(index, 'type', e.target.value)}
                  />
                </div>
                <div>
                  <Input 
                    placeholder="Duration" 
                    className="bg-gray-700/40 border-gray-700 text-white placeholder:text-gray-500"
                    value={item.duration}
                    onChange={(e) => handleActivityChange(index, 'duration', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <Button 
              variant="ghost" 
              className="w-full border border-dashed border-gray-700 hover:bg-gray-700/20 text-gray-400"
              onClick={() => addNewItem(activities, setActivities)}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Activity
            </Button>
          </div>
        </div>
      </Card>
      
      <PremiumVariablesSection />
    </div>
  );
}
