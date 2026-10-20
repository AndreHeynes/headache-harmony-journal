import { useLocations } from '@/contexts/LocationContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin } from 'lucide-react';
import { isOrigin } from '@/lib/analysis';

export function LocationTabs() {
  const { locations, activeLocationId, setActiveLocationId } = useLocations();

  if (locations.length <= 1) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Pain Location</span>
      </div>
      <Tabs value={activeLocationId || ''} onValueChange={setActiveLocationId}>
        <TabsList className="w-full flex-wrap h-auto gap-1 bg-muted/50">
          {locations.map((loc) => (
            <TabsTrigger
              key={loc.id}
              value={loc.id}
              className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {loc.selection_order != null ? `${loc.selection_order} · ` : ''}{loc.location_name}
              {isOrigin(loc) && <span className="ml-1 text-[10px] uppercase opacity-80">Origin</span>}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
