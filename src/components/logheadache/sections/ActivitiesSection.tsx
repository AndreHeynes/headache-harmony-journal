
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Activity {
  type: string;
  duration: string;
  hoursBefore: string;
}

interface ActivitiesSectionProps {
  activities: Activity[];
  onAddItem: () => void;
}

export function ActivitiesSection({ activities, onAddItem }: ActivitiesSectionProps) {
  return (
    <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Activities</h2>
      <div className="space-y-4">
        {activities.map((item, index) => (
          <div key={index} className="space-y-3">
            <Input
              type="text"
              placeholder="Activity Type"
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
            <div className="relative">
              <Input
                type="number"
                placeholder="Hours before headache"
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">hrs</span>
            </div>
            <div className="relative">
              <Input
                type="number"
                placeholder="Duration (optional)"
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">min</span>
            </div>
          </div>
        ))}
        <Button 
          onClick={onAddItem}
          className="w-full flex items-center justify-center space-x-2 bg-primary/10 border border-primary/30 hover:bg-primary/20 text-primary"
        >
          <Plus className="h-4 w-4" />
          <span>Add More Activities</span>
        </Button>
      </div>
    </section>
  );
}
