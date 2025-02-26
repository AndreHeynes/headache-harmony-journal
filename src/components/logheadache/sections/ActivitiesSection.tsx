
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Activity {
  type: string;
  duration: string;
}

interface ActivitiesSectionProps {
  activities: Activity[];
  onAddItem: () => void;
}

export function ActivitiesSection({ activities, onAddItem }: ActivitiesSectionProps) {
  return (
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
          onClick={onAddItem}
          className="w-full flex items-center justify-center space-x-2 bg-primary/20 border border-primary/30 hover:bg-primary/30"
        >
          <Plus className="h-4 w-4" />
          <span>Add More Activities</span>
        </Button>
      </div>
    </section>
  );
}
