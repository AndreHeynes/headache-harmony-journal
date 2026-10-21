import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import HeadMapPicker from "../skull-map/HeadMapPicker";
import { PainSpreadSelector } from "./pain-location/PainSpreadSelector";
import { useEpisode } from "@/contexts/EpisodeContext";
import { useLocations } from "@/contexts/LocationContext";
import { resolveRegion, REGION_LABELS } from "@/lib/regionMapping";

interface LogPainLocationProps {
  episodeId?: string | null;
}

export default function LogPainLocation({ episodeId }: LogPainLocationProps) {
  const [painSpreads, setPainSpreads] = useState(false);
  const [spreadPattern, setSpreadPattern] = useState("remain");
  const { updateEpisode } = useEpisode();
  const { locations, syncLocationsForEpisode } = useLocations();
  const [selectedIds, setSelectedIds] = useState<string[] | null>(null);

  // Saved areas resolved to new region IDs; old unmapped areas keep their own name
  const savedLabels = useMemo(() => {
    const m = new Map<string, string>();
    for (const l of locations) {
      const r = resolveRegion(l);
      if (!m.has(r.id)) m.set(r.id, r.label);
    }
    return m;
  }, [locations]);
  const savedIds = useMemo(() => [...savedLabels.keys()], [savedLabels]);
  const currentIds = selectedIds ?? savedIds;
  const labelFor = (id: string) => REGION_LABELS[id] ?? savedLabels.get(id) ?? id;
  const selectedNames = currentIds.map(labelFor);

  const buildLocationString = (names: string[], spreads: boolean, pattern: string) =>
    spreads ? `${names.join(", ")} (${pattern})` : names.join(", ");

  const handleSelectionChange = async (ids: string[]) => {
    setSelectedIds(ids);
    if (!episodeId) return;
    const areas = ids.map((key) => ({ key, name: labelFor(key) }));
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
            Tap an area, or press and drag to paint across several. You can select multiple areas — each will have its own intensity, symptoms, and triggers in the following steps.
          </p>
          <HeadMapPicker selected={currentIds} labelFor={labelFor} onChange={handleSelectionChange} />

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
