
import { useState } from "react";
import { Card } from "@/components/ui/card";
import SkullViewer from "../SkullViewer";
import { PainSpreadSelector } from "./pain-location/PainSpreadSelector";

export default function LogPainLocation() {
  const [painSpreads, setPainSpreads] = useState(false);
  const [spreadPattern, setSpreadPattern] = useState("remain");

  return (
    <div className="space-y-6">
      <Card className="bg-[#0a192f]/90 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Select Pain Location</h2>
          <p className="text-sm text-white/70">
            Click on the skull diagram to mark your pain locations. The app will automatically determine distribution patterns.
          </p>
          <SkullViewer />
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
