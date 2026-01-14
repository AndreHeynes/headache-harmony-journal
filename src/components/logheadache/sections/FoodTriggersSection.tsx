
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
    <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Food Triggers</h2>
      <div className="space-y-4">
        {foodItems.map((item, index) => (
          <div key={index} className="space-y-3">
            <Input
              type="text"
              placeholder="Food Item"
            />
            <div className="relative">
              <Input
                type="number"
                placeholder="Hours before headache"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">hrs</span>
            </div>
          </div>
        ))}
        <Button 
          onClick={onAddItem}
          variant="outline"
          className="w-full flex items-center justify-center space-x-2 border-primary/30 text-primary hover:bg-primary/10"
        >
          <Plus className="h-4 w-4" />
          <span>Add More Food Items</span>
        </Button>
      </div>
    </section>
  );
}
