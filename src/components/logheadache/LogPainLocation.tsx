
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skull } from "lucide-react";

import { HeadRegionSelector } from "./pain-location/HeadRegionSelector";
import { PainDistributionSelector } from "./pain-location/PainDistributionSelector";
import { PainPatternSelector } from "./pain-location/PainPatternSelector";
import { PainSpreadSelector } from "./pain-location/PainSpreadSelector";

export default function LogPainLocation() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [painDistribution, setPainDistribution] = useState<string | null>(null);
  const [painPattern, setPainPattern] = useState("medial");
  const [painSpreads, setPainSpreads] = useState(false);
  const [spreadPattern, setSpreadPattern] = useState("remain");
  const [viewMode, setViewMode] = useState<"anterior" | "posterior">("anterior");

  const toggleView = () => {
    setViewMode(viewMode === "anterior" ? "posterior" : "anterior");
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-white">Where did the pain start?</h2>
            <Button 
              variant="outline" 
              onClick={toggleView} 
              className="bg-gray-700/40 text-gray-200 hover:bg-gray-700/60"
            >
              {viewMode === "anterior" ? "View Back of Head" : "View Front of Head"}
              <Skull className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <HeadRegionSelector 
            selectedRegion={selectedRegion} 
            setSelectedRegion={(region) => setSelectedRegion(region)} 
            viewMode={viewMode}
            toggleView={toggleView}
          />
        </div>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Pain Distribution</h2>
          <PainDistributionSelector 
            painDistribution={painDistribution} 
            setPainDistribution={setPainDistribution} 
          />
        </div>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Distribution Pattern</h2>
          <PainPatternSelector 
            painPattern={painPattern} 
            setPainPattern={setPainPattern} 
          />
        </div>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <PainSpreadSelector 
            painSpreads={painSpreads} 
            setPainSpreads={setPainSpreads} 
            spreadPattern={spreadPattern} 
            setSpreadPattern={setSpreadPattern} 
          />
        </div>
      </Card>
    </div>
  );
}
