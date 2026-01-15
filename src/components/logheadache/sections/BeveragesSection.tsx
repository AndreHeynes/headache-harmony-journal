
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Beverage {
  beverage: string;
  hours: string;
}

interface BeveragesSectionProps {
  beverages: Beverage[];
  onAddItem: () => void;
}

export function BeveragesSection({ beverages, onAddItem }: BeveragesSectionProps) {
  return (
    <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Fluid/Drinks</h2>
      <div className="space-y-4">
        {beverages.map((item, index) => (
          <div key={index} className="space-y-3">
            <Input
              type="text"
              placeholder="Beverage"
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
          </div>
        ))}
        <Button 
          onClick={onAddItem}
          className="w-full flex items-center justify-center space-x-2 bg-primary/10 border border-primary/30 hover:bg-primary/20 text-primary"
        >
          <Plus className="h-4 w-4" />
          <span>Add More Beverages</span>
        </Button>
      </div>
    </section>
  );
}
