
import { useState } from "react";
import { Card } from "@/components/ui/card";
import SkullViewer from "../SkullViewer";
import { PainDistributionSelector } from "./pain-location/PainDistributionSelector";
import { PainPatternSelector } from "./pain-location/PainPatternSelector";
import { PainSpreadSelector } from "./pain-location/PainSpreadSelector";

export default function LogPainLocation() {
  const [painDistribution, setPainDistribution] = useState<string | null>(null);
  const [painPattern, setPainPattern] = useState("medial");
  const [painSpreads, setPainSpreads] = useState(false);
  const [spreadPattern, setSpreadPattern] = useState("remain");

  return (
    <div className="space-y-6">
      <Card className="bg-[#0a192f]/90 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Select Pain Location</h2>
          <SkullViewer />
        </div>
      </Card>

      <Card className="bg-[#0a192f]/90 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Pain Distribution</h2>
          <PainDistributionSelector 
            painDistribution={painDistribution} 
            setPainDistribution={setPainDistribution} 
          />
        </div>
      </Card>

      <Card className="bg-[#0a192f]/90 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Distribution Pattern</h2>
          <PainPatternSelector 
            painPattern={painPattern} 
            setPainPattern={setPainPattern} 
          />
        </div>
      </Card>

      <Card className="bg-[#0a192f]/90 border-gray-700 backdrop-blur-sm">
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
