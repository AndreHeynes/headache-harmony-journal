import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import SkullViewer from "../SkullViewer";
import { PainSpreadSelector } from "./pain-location/PainSpreadSelector";
import { useEpisode } from "@/contexts/EpisodeContext";

interface LogPainLocationProps {
  episodeId?: string | null;
}

export default function LogPainLocation({ episodeId }: LogPainLocationProps) {
  const [painSpreads, setPainSpreads] = useState(false);
  const [spreadPattern, setSpreadPattern] = useState("remain");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const { updateEpisode, activeEpisode } = useEpisode();

  // Load existing pain location
  useEffect(() => {
    if (activeEpisode?.pain_location) {
      setSelectedLocation(activeEpisode.pain_location);
    }
  }, [activeEpisode]);

  const handleLocationChange = async (location: string) => {
    setSelectedLocation(location);
    if (episodeId) {
      const fullLocation = painSpreads 
        ? `${location} (${spreadPattern})`
        : location;
      await updateEpisode(episodeId, { pain_location: fullLocation });
    }
  };

  const handleSpreadChange = async (spreads: boolean, pattern: string) => {
    setPainSpreads(spreads);
    setSpreadPattern(pattern);
    
    if (episodeId && selectedLocation) {
      const fullLocation = spreads 
        ? `${selectedLocation} (${pattern})`
        : selectedLocation;
      await updateEpisode(episodeId, { pain_location: fullLocation });
    }
  };

  return (
    <div className="space-y-6">
      {/* Phase 1 Introduction Video */}
      <Card className="bg-[#0a192f]/90 border-gray-700 backdrop-blur-sm overflow-hidden">
        <div className="p-4 space-y-3">
          <h2 className="text-lg font-medium text-white">Phase 1: Pain Location Tracking</h2>
          <p className="text-sm text-white/70">
            Watch this quick introduction to understand how to log your headache locations effectively.
          </p>
          <div className="relative aspect-video rounded-lg overflow-hidden bg-black/50">
            <video 
              controls 
              className="w-full h-full object-contain"
              poster="/videos/phase1-intro-poster.jpg"
            >
              <source src="/videos/phase1-intro.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </Card>

      <Card className="bg-[#0a192f]/90 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Select Pain Location</h2>
          <p className="text-sm text-white/70">
            Click on the skull diagram to mark your pain locations. The app will automatically determine distribution patterns.
          </p>
          <SkullViewer onLocationSelect={handleLocationChange} />
        </div>
      </Card>

      <Card className="bg-[#0a192f]/90 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <PainSpreadSelector 
            painSpreads={painSpreads} 
            setPainSpreads={(spreads) => handleSpreadChange(spreads, spreadPattern)} 
            spreadPattern={spreadPattern} 
            setSpreadPattern={(pattern) => handleSpreadChange(painSpreads, pattern)} 
          />
        </div>
      </Card>
    </div>
  );
}
