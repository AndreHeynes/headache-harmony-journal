
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FoodTriggersSection } from "./sections/FoodTriggersSection";
import { BeveragesSection } from "./sections/BeveragesSection";
import { StressTriggersSection } from "./sections/StressTriggersSection";
import { ActivitiesSection } from "./sections/ActivitiesSection";
import { PremiumVariablesSection } from "./sections/PremiumVariablesSection";

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
        <FoodTriggersSection 
          foodItems={foodItems}
          onAddItem={() => addNewItem(foodItems, setFoodItems)}
        />
        
        <BeveragesSection 
          beverages={beverages}
          onAddItem={() => addNewItem(beverages, setBeverages)}
        />
        
        <StressTriggersSection />
        
        <ActivitiesSection 
          activities={activities}
          onAddItem={() => addNewItem(activities, setActivities)}
        />
        
        <PremiumVariablesSection isPremium={isPremium} />
      </main>
    </div>
  );
}
