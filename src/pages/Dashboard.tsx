import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/layout/BottomNav";
import { Lock, TrendingUp, Calendar, Clock, Activity } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import { useEpisode } from "@/contexts/EpisodeContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { EmptyDashboard } from "@/components/dashboard/EmptyDashboard";
import { formatDistanceToNow, format } from "date-fns";
import { useEffect } from "react";

export default function Dashboard() {
  const isPremium = false;
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { activeEpisode, checkForActiveEpisode } = useEpisode();
  const { data, loading } = useDashboardData();

  useEffect(() => {
    // Only check for episodes after auth is loaded
    if (!authLoading && user) {
      checkForActiveEpisode();
    }
  }, [checkForActiveEpisode, authLoading, user]);

  const handleViewAllEntries = () => {
    navigate("/analysis");
  };

  const handleUpgradeForInsights = () => {
    navigate("/analysis");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  if (!data || data.recentEpisodes.length === 0) {
    return (
      <>
        <Helmet>
          <title>Dashboard - Headache Journal™</title>
        </Helmet>
        <div className="min-h-screen bg-background text-foreground">
          <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-sm border-b border-border p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-foreground">Headache Journal™</h1>
              <Link to="/profile">
                <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </header>
          <main className="p-4 pb-20">
            <EmptyDashboard />
          </main>
          <BottomNav />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Headache Journal™</title>
      </Helmet>
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-sm border-b border-border p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Headache Journal™</h1>
            <Link to="/profile">
              <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        <main className="p-4 pb-20 space-y-6">
          {/* Active Episode Indicator */}
          {activeEpisode && (
            <Card className="bg-gradient-to-r from-red-900/50 to-orange-900/50 border-red-700">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Activity className="h-5 w-5 animate-pulse text-red-400" />
                  <span>Active Episode</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Started</span>
                  <span className="text-foreground">{formatDistanceToNow(new Date(activeEpisode.start_time), { addSuffix: true })}</span>
                </div>
                {activeEpisode.pain_intensity && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Intensity</span>
                    <span className="text-primary font-semibold">{activeEpisode.pain_intensity}/10</span>
                  </div>
                )}
                <Button 
                  onClick={() => navigate('/log')}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Continue Logging
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Last Headache Summary */}
          {data.lastEpisode && (
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center justify-between">
                  <span>Last Headache</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {formatDistanceToNow(new Date(data.lastEpisode.start_time), { addSuffix: true })}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.lastEpisode.pain_intensity && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Intensity</span>
                    <span className="text-primary font-semibold">{data.lastEpisode.pain_intensity}/10</span>
                  </div>
                )}
                {data.lastEpisode.duration_minutes && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="text-foreground">
                      {Math.floor(data.lastEpisode.duration_minutes / 60)}h {data.lastEpisode.duration_minutes % 60}m
                    </span>
                  </div>
                )}
                {data.lastEpisode.pain_location && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Location</span>
                    <span className="text-foreground">{data.lastEpisode.pain_location}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Weekly Overview */}
          <Card className="bg-card border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground">Weekly Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-7 gap-2">
                {data.weeklyChartData.map((day) => (
                  <div key={day.date} className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">{day.date}</div>
                    <div className={`h-12 rounded ${
                      day.count > 0 ? "bg-red-900/50 border border-red-700" : "bg-muted"
                    } flex items-center justify-center text-sm text-foreground`}>
                      {day.count}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total this week</span>
                  <span className="text-foreground font-semibold">{data.weeklyCount} episodes</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Entries */}
          <Card className="bg-card border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center justify-between">
                <span>Recent Entries</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleViewAllEntries}
                  className="text-primary hover:text-primary/80"
                >
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.recentEpisodes.map((episode) => (
                  <div 
                    key={episode.id} 
                    className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer border border-border"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-foreground">
                        {episode.pain_location || 'Headache'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(episode.start_time), 'MMM d')}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      {episode.pain_intensity && (
                        <span>Intensity: {episode.pain_intensity}/10</span>
                      )}
                      {episode.duration_minutes && (
                        <span>Duration: {Math.floor(episode.duration_minutes / 60)}h {episode.duration_minutes % 60}m</span>
                      )}
                    </div>
                    {episode.status === 'active' && (
                      <div className="mt-2 text-xs text-red-400 flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        <span>Ongoing</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Insights */}
          <Card className="bg-card border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center justify-between">
                <span>Quick Insights</span>
                {!isPremium && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleUpgradeForInsights}
                    className="text-primary hover:text-primary/80"
                  >
                    <Lock className="h-4 w-4 mr-1" />
                    Unlock
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.avgPainIntensity > 0 && (
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-foreground text-sm">
                      Average intensity: <span className="font-semibold">{data.avgPainIntensity}/10</span>
                    </p>
                    <p className="text-muted-foreground text-xs mt-1">Based on your recent episodes</p>
                  </div>
                </div>
              )}
              
              {data.mostCommonTrigger && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-foreground text-sm">
                      Most common trigger: <span className="font-semibold">{data.mostCommonTrigger}</span>
                    </p>
                    <p className="text-muted-foreground text-xs mt-1">Track patterns to manage triggers</p>
                  </div>
                </div>
              )}
              
              {data.avgDuration > 0 && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-foreground text-sm">
                      Average duration: <span className="font-semibold">
                        {Math.floor(data.avgDuration / 60)}h {data.avgDuration % 60}m
                      </span>
                    </p>
                    <p className="text-muted-foreground text-xs mt-1">Based on completed episodes</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>

        <BottomNav />
      </div>
    </>
  );
}
