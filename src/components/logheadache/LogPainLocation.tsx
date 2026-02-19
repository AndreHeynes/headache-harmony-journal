import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import SkullViewer from "../SkullViewer";
import { PainSpreadSelector } from "./pain-location/PainSpreadSelector";
import { useEpisode } from "@/contexts/EpisodeContext";
import { useLocations } from "@/contexts/LocationContext";
import { SKULL_HOTSPOTS } from "../skull-viewer/skull-hotspots";

interface LogPainLocationProps {
  episodeId?: string | null;
}

export default function LogPainLocation({ episodeId }: LogPainLocationProps) {
  const [painSpreads, setPainSpreads] = useState(false);
  const [spreadPattern, setSpreadPattern] = useState("remain");
  const [selectedLocationNames, setSelectedLocationNames] = useState<string[]>([]);
  const { updateEpisode, activeEpisode } = useEpisode();
  const { createLocationsForEpisode } = useLocations();

  // Load existing pain location
  useEffect(() => {
    if (activeEpisode?.pain_location) {
      const names = activeEpisode.pain_location.split(', ').filter(Boolean);
      setSelectedLocationNames(names);
    }
  }, [activeEpisode]);

  const handleLocationChange = async (locationString: string) => {
    // locationString is comma-separated hotspot IDs from SkullViewer
    const ids = locationString.split(', ').filter(Boolean);
    
    // Map hotspot IDs to readable names
    const names = ids.map(id => {
      const hotspot = SKULL_HOTSPOTS.find(h => h.id === id);
      return hotspot?.title || id;
    });
    
    setSelectedLocationNames(names);

    if (episodeId) {
      // Save the combined string to the episode for backward compatibility
      const fullLocation = painSpreads 
        ? `${names.join(', ')} (${spreadPattern})`
        : names.join(', ');
      await updateEpisode(episodeId, { pain_location: fullLocation });

      // Create individual location records
      if (names.length > 0) {
        await createLocationsForEpisode(episodeId, names);
      }
    }
  };

  const handleSpreadChange = async (spreads: boolean, pattern: string) => {
    setPainSpreads(spreads);
    setSpreadPattern(pattern);
    
    if (episodeId && selectedLocationNames.length > 0) {
      const fullLocation = spreads 
        ? `${selectedLocationNames.join(', ')} (${pattern})`
        : selectedLocationNames.join(', ');
      await updateEpisode(episodeId, { pain_location: fullLocation });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-foreground">Select Pain Location(s)</h2>
          <p className="text-sm text-muted-foreground">
            Click on the skull diagram to mark your pain locations. You can select multiple areas — each will have its own intensity, symptoms, and triggers in the following steps.
          </p>
          <SkullViewer onLocationSelect={handleLocationChange} />
          
          {selectedLocationNames.length > 1 && (
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
              <p className="text-sm text-primary font-medium">
                {selectedLocationNames.length} locations selected — you'll provide details for each in the next steps.
              </p>
            </div>
          )}
        </div>
      </Card>

      <Card className="bg-card border-border backdrop-blur-sm">
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
