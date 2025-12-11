import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link2, Link2Off, RefreshCw, Clock, Smartphone, Loader2 } from "lucide-react";
import { useHealthTrackerConnections, TRACKER_INFO, TrackerProvider } from "@/hooks/useHealthTrackerConnections";
import { format } from "date-fns";
import { CycleDataImport } from "./CycleDataImport";

export function HealthTrackerConnectionsCard() {
  const {
    connections,
    loading,
    initiateConnection,
    disconnectTracker,
    toggleSync,
    syncTracker,
    getConnectionStatus,
  } = useHealthTrackerConnections();
  
  const [syncing, setSyncing] = useState<TrackerProvider | null>(null);
  
  const handleSync = async (provider: TrackerProvider) => {
    setSyncing(provider);
    await syncTracker(provider);
    setSyncing(null);
  };

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Health Tracker Connections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Link2 className="h-5 w-5" />
          Health Tracker Connections
        </CardTitle>
        <CardDescription>
          Connect external sleep and menstrual cycle trackers for more accurate analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {TRACKER_INFO.map((tracker) => {
          const connection = getConnectionStatus(tracker.provider);
          const isConnected = connection?.is_connected;
          const isPending = connection && !connection.is_connected;

          return (
            <div
              key={tracker.provider}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{tracker.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{tracker.name}</span>
                    {tracker.requiresNativeApp && (
                      <Badge variant="outline" className="text-xs">
                        <Smartphone className="h-3 w-3 mr-1" />
                        Native App
                      </Badge>
                    )}
                    {isConnected && (
                      <Badge className="bg-green-600 text-white">Connected</Badge>
                    )}
                    {isPending && (
                      <Badge variant="secondary">Pending Setup</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{tracker.description}</p>
                  <div className="flex gap-1 mt-1">
                    {tracker.dataTypes.map((type) => (
                      <Badge key={type} variant="outline" className="text-xs capitalize">
                        {type}
                      </Badge>
                    ))}
                  </div>
                  {connection?.last_sync_at && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Last synced: {format(new Date(connection.last_sync_at), 'MMM d, h:mm a')}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isConnected && (
                  <>
                    <div className="flex items-center gap-2 mr-2">
                      <span className="text-xs text-muted-foreground">Auto-sync</span>
                      <Switch
                        checked={connection?.sync_enabled ?? true}
                        onCheckedChange={(checked) => toggleSync(tracker.provider, checked)}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSync(tracker.provider)}
                      disabled={syncing === tracker.provider}
                    >
                      {syncing === tracker.provider ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => disconnectTracker(tracker.provider)}
                    >
                      <Link2Off className="h-4 w-4" />
                    </Button>
                  </>
                )}
                {!isConnected && (
                  <Button
                    variant={tracker.available ? "default" : "secondary"}
                    size="sm"
                    onClick={() => initiateConnection(tracker.provider)}
                    disabled={!tracker.available}
                    className={!tracker.available ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    {tracker.available ? 'Connect' : 'Coming Soon'}
                  </Button>
                )}
              </div>
            </div>
          );
        })}

        <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Note:</strong> If no external tracker is connected, 
            the app will use your manually logged sleep and menstrual data from headache entries for analysis.
          </p>
        </div>

        {/* CSV Import Section */}
        <div className="mt-6 pt-6 border-t border-border">
          <CycleDataImport />
        </div>
      </CardContent>
    </Card>
  );
}
