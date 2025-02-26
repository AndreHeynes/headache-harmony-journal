
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Crown, Plus, Sun, Moon, CloudRain, Coffee, Moon as SleepIcon } from "lucide-react";

export default function LogTriggers() {
  const navigate = useNavigate();
  const [foodItems, setFoodItems] = useState([{ food: "", hours: "" }]);
  const [beverages, setBeverages] = useState([{ beverage: "", hours: "" }]);
  const [activities, setActivities] = useState([{ type: "", duration: "" }]);
  const isPremium = false; // This would come from your user context/state

  const addNewItem = (list: any[], setList: (items: any[]) => void) => {
    setList([...list, { food: "", hours: "", beverage: "", type: "", duration: "" }]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <header className="flex items-center justify-between mb-6">
        <button className="text-gray-400" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-chevron-left text-xl"></i>
        </button>
        <h1 className="text-xl font-semibold">Triggers</h1>
        <button className="text-gray-400">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
      </header>

      <main className="space-y-6">
        {/* Food Triggers Section */}
        <section className="bg-gray-800/50 rounded-xl p-6 shadow-lg backdrop-blur-sm border border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Food Triggers</h2>
          <div className="space-y-4">
            {foodItems.map((item, index) => (
              <div key={index} className="space-y-3">
                <Input
                  type="text"
                  placeholder="Food Item"
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                />
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Hours before headache"
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">hrs</span>
                </div>
              </div>
            ))}
            <Button 
              onClick={() => addNewItem(foodItems, setFoodItems)}
              className="w-full flex items-center justify-center space-x-2 bg-primary/20 border border-primary/30 hover:bg-primary/30"
            >
              <Plus className="h-4 w-4" />
              <span>Add More Food Items</span>
            </Button>
          </div>
        </section>

        {/* Fluid/Drinks Section */}
        <section className="bg-gray-800/50 rounded-xl p-6 shadow-lg backdrop-blur-sm border border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Fluid/Drinks</h2>
          <div className="space-y-4">
            {beverages.map((item, index) => (
              <div key={index} className="space-y-3">
                <Input
                  type="text"
                  placeholder="Beverage"
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                />
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Hours before headache"
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">hrs</span>
                </div>
              </div>
            ))}
            <Button 
              onClick={() => addNewItem(beverages, setBeverages)}
              className="w-full flex items-center justify-center space-x-2 bg-primary/20 border border-primary/30 hover:bg-primary/30"
            >
              <Plus className="h-4 w-4" />
              <span>Add More Beverages</span>
            </Button>
          </div>
        </section>

        {/* Stress Triggers Section */}
        <section className="bg-gray-800/50 rounded-xl p-6 shadow-lg backdrop-blur-sm border border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Stress Triggers</h2>
          <div className="grid grid-cols-2 gap-3">
            {["Physical", "Emotional", "Psychological", "Family", "Financial", "Social"].map((type) => (
              <label key={type} className="flex items-center space-x-3 bg-gray-700/30 border border-gray-600 rounded-lg p-4">
                <Checkbox className="border-gray-500 data-[state=checked]:bg-primary" />
                <span className="text-gray-300">{type}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Activities Section */}
        <section className="bg-gray-800/50 rounded-xl p-6 shadow-lg backdrop-blur-sm border border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Activities</h2>
          <div className="space-y-4">
            {activities.map((item, index) => (
              <div key={index} className="space-y-3">
                <Input
                  type="text"
                  placeholder="Activity Type"
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                />
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Duration"
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">min</span>
                </div>
              </div>
            ))}
            <Button 
              onClick={() => addNewItem(activities, setActivities)}
              className="w-full flex items-center justify-center space-x-2 bg-primary/20 border border-primary/30 hover:bg-primary/30"
            >
              <Plus className="h-4 w-4" />
              <span>Add More Activities</span>
            </Button>
          </div>
        </section>

        {/* Premium Variables Section */}
        <section className="bg-gray-800/50 rounded-xl p-6 shadow-lg backdrop-blur-sm border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Additional Variables</h2>
            <Crown className="h-5 w-5 text-yellow-500" />
          </div>
          
          {!isPremium ? (
            <div className="text-center py-6">
              <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">Unlock premium variables to track:</p>
              <ul className="text-sm text-gray-400 space-y-2 mb-6">
                <li className="flex items-center justify-center gap-2">
                  <SleepIcon className="h-4 w-4" /> Sleep Patterns
                </li>
                <li className="flex items-center justify-center gap-2">
                  <Sun className="h-4 w-4" /> Environmental Conditions
                </li>
                <li className="flex items-center justify-center gap-2">
                  <CloudRain className="h-4 w-4" /> Weather Changes
                </li>
                <li className="flex items-center justify-center gap-2">
                  <Coffee className="h-4 w-4" /> Caffeine Intake
                </li>
              </ul>
              <Button variant="outline" className="bg-yellow-500/20 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/30">
                Upgrade to Premium
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Premium variable inputs would go here */}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
