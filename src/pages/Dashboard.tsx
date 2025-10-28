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
  const { user } = useAuth();
  const { activeEpisode, checkForActiveEpisode } = useEpisode();
  const { data, loading } = useDashboardData();

  useEffect(() => {
    checkForActiveEpisode();
  }, [checkForActiveEpisode]);

  const handleViewAllEntries = () => {
    navigate("/analysis");
  };

  const handleUpgradeForInsights = () => {
    navigate("/analysis");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="animate-pulse text-white">Loading dashboard...</div>
      </div>
    );
  }

  if (!data || data.recentEpisodes.length === 0) {
    return (
      <>
        <Helmet>
          <title>Dashboard - Headache Journal™</title>
        </Helmet>
        <div className="min-h-screen bg-charcoal text-white">
          <header className="sticky top-0 z-40 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Headache Journal™</h1>
              <Link to="/profile">
                <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                  <AvatarFallback className="bg-primary text-charcoal">
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
      <div className="min-h-screen bg-charcoal text-white">
        <header className="sticky top-0 z-40 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Headache Journal™</h1>
            <Link to="/profile">
              <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                <AvatarFallback className="bg-primary text-charcoal">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        <main className="p-4 pb-20 space-y-6">
          {/* Active Episode Indicator */}
          {activeEpisode && (
            <Card className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border-red-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 animate-pulse" />
                  <span>Active Episode</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Started</span>
                  <span className="text-white">{formatDistanceToNow(new Date(activeEpisode.start_time), { addSuffix: true })}</span>
                </div>
                {activeEpisode.pain_intensity && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Intensity</span>
                    <span className="text-primary font-semibold">{activeEpisode.pain_intensity}/10</span>
                  </div>
                )}
                <Button 
                  onClick={() => navigate('/log')}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Continue Logging
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Last Headache Summary */}
          {data.lastEpisode && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Last Headache</span>
                  <span className="text-sm font-normal text-white/60">
                    {formatDistanceToNow(new Date(data.lastEpisode.start_time), { addSuffix: true })}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.lastEpisode.pain_intensity && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Intensity</span>
                    <span className="text-primary font-semibold">{data.lastEpisode.pain_intensity}/10</span>
                  </div>
                )}
                {data.lastEpisode.duration_minutes && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Duration</span>
                    <span className="text-white">
                      {Math.floor(data.lastEpisode.duration_minutes / 60)}h {data.lastEpisode.duration_minutes % 60}m
                    </span>
                  </div>
                )}
                {data.lastEpisode.pain_location && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Location</span>
                    <span className="text-white">{data.lastEpisode.pain_location}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Weekly Overview */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Weekly Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-7 gap-2">
                {data.weeklyChartData.map((day) => (
                  <div key={day.date} className="text-center">
                    <div className="text-xs text-white/60 mb-1">{day.date}</div>
                    <div className={`h-12 rounded ${
                      day.count > 0 ? "bg-red-500/30" : "bg-gray-700/50"
                    } flex items-center justify-center text-sm text-white`}>
                      {day.count}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Total this week</span>
                  <span className="text-white font-semibold">{data.weeklyCount} episodes</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Entries */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
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
                    className="p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-white">
                        {episode.pain_location || 'Headache'}
                      </span>
                      <span className="text-xs text-white/60">
                        {format(new Date(episode.start_time), 'MMM d')}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-white/70">
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
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
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
                    <p className="text-white text-sm">
                      Average intensity: <span className="font-semibold">{data.avgPainIntensity}/10</span>
                    </p>
                    <p className="text-white/60 text-xs mt-1">Based on your recent episodes</p>
                  </div>
                </div>
              )}
              
              {data.mostCommonTrigger && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-white text-sm">
                      Most common trigger: <span className="font-semibold">{data.mostCommonTrigger}</span>
                    </p>
                    <p className="text-white/60 text-xs mt-1">Track patterns to manage triggers</p>
                  </div>
                </div>
              )}
              
              {data.avgDuration > 0 && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-white text-sm">
                      Average duration: <span className="font-semibold">
                        {Math.floor(data.avgDuration / 60)}h {data.avgDuration % 60}m
                      </span>
                    </p>
                    <p className="text-white/60 text-xs mt-1">Based on completed episodes</p>
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
