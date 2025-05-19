
import { Button } from "@/components/ui/button";

interface PainDistributionSelectorProps {
  painDistribution: string | null;
  setPainDistribution: (distribution: string) => void;
}

export function PainDistributionSelector({ painDistribution, setPainDistribution }: PainDistributionSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Button 
        variant="secondary" 
        className={`
          bg-gray-700/40 hover:bg-gray-700/60 text-white
          ${painDistribution === "left" && "bg-primary/50 border border-primary"}
        `}
        onClick={() => setPainDistribution("left")}
      >
        Left Side
      </Button>
      <Button 
        variant="secondary" 
        className={`
          bg-gray-700/40 hover:bg-gray-700/60 text-white
          ${painDistribution === "both" && "bg-primary/50 border border-primary"}
        `}
        onClick={() => setPainDistribution("both")}
      >
        Both Sides
      </Button>
      <Button 
        variant="secondary" 
        className={`
          bg-gray-700/40 hover:bg-gray-700/60 text-white
          ${painDistribution === "right" && "bg-primary/50 border border-primary"}
        `}
        onClick={() => setPainDistribution("right")}
      >
        Right Side
      </Button>
    </div>
  );
}
