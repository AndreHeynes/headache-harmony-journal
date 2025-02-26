
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FoodItem {
  food: string;
  hours: string;
}

interface FoodTriggersSectionProps {
  foodItems: FoodItem[];
  onAddItem: () => void;
}

export function FoodTriggersSection({ foodItems, onAddItem }: FoodTriggersSectionProps) {
  return (
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
          onClick={onAddItem}
          className="w-full flex items-center justify-center space-x-2 bg-primary/20 border border-primary/30 hover:bg-primary/30"
        >
          <Plus className="h-4 w-4" />
          <span>Add More Food Items</span>
        </Button>
      </div>
    </section>
  );
}
