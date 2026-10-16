import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import SkullViewer from "../SkullViewer";
import { PainSpreadSelector } from "./pain-location/PainSpreadSelector";
import { useEpisode } from "@/contexts/EpisodeContext";
import { useLocations } from "@/contexts/LocationContext";
import { getAreaLabel, areaKeyFromLabel } from "../skull-viewer/skull-hotspots";

interface LogPainLocationProps {
  episodeId?: string | null;
}

export default function LogPainLocation({ episodeId }: LogPainLocationProps) {
  const [painSpreads, setPainSpreads] = useState(false);
  const [spreadPattern, setSpreadPattern] = useState("remain");
  const { updateEpisode } = useEpisode();
  const { locations, syncLocationsForEpisode } = useLocations();
  const [selectedKeys, setSelectedKeys] = useState<string[] | null>(null);

  // Saved selection (stable keys; legacy rows fall back to name lookup)
  const savedKeys = useMemo(
    () =>
      locations
        .map((l) => l.location_key || areaKeyFromLabel(l.location_name))
        .filter((k): k is string => !!k),
    [locations]
  );
  const currentKeys = selectedKeys ?? savedKeys;
  const selectedNames = currentKeys.map(getAreaLabel);

  const buildLocationString = (names: string[], spreads: boolean, pattern: string) =>
    spreads ? `${names.join(", ")} (${pattern})` : names.join(", ");

  const handleSelectionChange = async (keys: string[]) => {
    setSelectedKeys(keys);
    if (!episodeId) return;
    const areas = keys.map((key) => ({ key, name: getAreaLabel(key) }));
    // Episode-level text kept for backward compatibility with older screens
    await updateEpisode(episodeId, {
      pain_location: buildLocationString(areas.map((a) => a.name), painSpreads, spreadPattern),
    });
    await syncLocationsForEpisode(episodeId, areas);
  };

  const handleSpreadChange = async (spreads: boolean, pattern: string) => {
    setPainSpreads(spreads);
    setSpreadPattern(pattern);
    if (episodeId && selectedNames.length > 0) {
      await updateEpisode(episodeId, { pain_location: buildLocationString(selectedNames, spreads, pattern) });
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
          <SkullViewer onSelectionChange={handleSelectionChange} initialSelection={savedKeys} />

          {selectedNames.length > 1 && (
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
              <p className="text-sm text-primary font-medium">
                {selectedNames.length} locations selected — you'll provide details for each in the next steps.
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
