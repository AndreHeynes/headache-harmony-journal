
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { FoodTriggersSection } from "./sections/FoodTriggersSection";
import { BeveragesSection } from "./sections/BeveragesSection";
import { StressTriggersSection } from "./sections/StressTriggersSection";
import { ActivitiesSection } from "./sections/ActivitiesSection";
import { PremiumVariablesSection } from "./sections/PremiumVariablesSection";

export default function LogTriggers() {
  const [foodItems, setFoodItems] = useState([{ food: "", hours: "" }]);
  const [beverages, setBeverages] = useState([{ beverage: "", hours: "" }]);
  const [activities, setActivities] = useState([{ type: "", duration: "" }]);

  const addNewItem = (list: any[], setList: (items: any[]) => void) => {
    setList([...list, { food: "", hours: "", beverage: "", type: "", duration: "" }]);
  };

  return (
    <div className="space-y-6">
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
                  />
                </div>
                <div>
                  <Input 
                    placeholder="Hours before" 
                    className="bg-gray-700/40 border-gray-700 text-white placeholder:text-gray-500" 
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
                  />
                </div>
                <div>
                  <Input 
                    placeholder="Hours before" 
                    className="bg-gray-700/40 border-gray-700 text-white placeholder:text-gray-500" 
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
                  />
                </div>
                <div>
                  <Input 
                    placeholder="Duration" 
                    className="bg-gray-700/40 border-gray-700 text-white placeholder:text-gray-500" 
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
