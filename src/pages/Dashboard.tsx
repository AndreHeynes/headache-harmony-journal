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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (!data || data.recentEpisodes.length === 0) {
    return (
      <>
        <Helmet>
          <title>Dashboard - Headache Journal™</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">Headache Journal™</h1>
              <Link to="/profile">
                <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                  <AvatarFallback className="bg-primary text-white">
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
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Headache Journal™</h1>
            <Link to="/profile">
              <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                <AvatarFallback className="bg-primary text-white">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        <main className="p-4 pb-20 space-y-6">
          {/* Active Episode Indicator */}
          {activeEpisode && (
            <Card className="bg-gradient-to-r from-red-100 to-orange-100 border-red-200">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Activity className="h-5 w-5 animate-pulse text-red-500" />
                  <span>Active Episode</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Started</span>
                  <span className="text-gray-900">{formatDistanceToNow(new Date(activeEpisode.start_time), { addSuffix: true })}</span>
                </div>
                {activeEpisode.pain_intensity && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Intensity</span>
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
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center justify-between">
                  <span>Last Headache</span>
                  <span className="text-sm font-normal text-gray-500">
                    {formatDistanceToNow(new Date(data.lastEpisode.start_time), { addSuffix: true })}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.lastEpisode.pain_intensity && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Intensity</span>
                    <span className="text-primary font-semibold">{data.lastEpisode.pain_intensity}/10</span>
                  </div>
                )}
                {data.lastEpisode.duration_minutes && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Duration</span>
                    <span className="text-gray-900">
                      {Math.floor(data.lastEpisode.duration_minutes / 60)}h {data.lastEpisode.duration_minutes % 60}m
                    </span>
                  </div>
                )}
                {data.lastEpisode.pain_location && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Location</span>
                    <span className="text-gray-900">{data.lastEpisode.pain_location}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Weekly Overview */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Weekly Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-7 gap-2">
                {data.weeklyChartData.map((day) => (
                  <div key={day.date} className="text-center">
                    <div className="text-xs text-gray-500 mb-1">{day.date}</div>
                    <div className={`h-12 rounded ${
                      day.count > 0 ? "bg-red-100 border border-red-200" : "bg-gray-100"
                    } flex items-center justify-center text-sm text-gray-900`}>
                      {day.count}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total this week</span>
                  <span className="text-gray-900 font-semibold">{data.weeklyCount} episodes</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Entries */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center justify-between">
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
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900">
                        {episode.pain_location || 'Headache'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(new Date(episode.start_time), 'MMM d')}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600">
                      {episode.pain_intensity && (
                        <span>Intensity: {episode.pain_intensity}/10</span>
                      )}
                      {episode.duration_minutes && (
                        <span>Duration: {Math.floor(episode.duration_minutes / 60)}h {episode.duration_minutes % 60}m</span>
                      )}
                    </div>
                    {episode.status === 'active' && (
                      <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
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
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center justify-between">
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
                    <p className="text-gray-900 text-sm">
                      Average intensity: <span className="font-semibold">{data.avgPainIntensity}/10</span>
                    </p>
                    <p className="text-gray-500 text-xs mt-1">Based on your recent episodes</p>
                  </div>
                </div>
              )}
              
              {data.mostCommonTrigger && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-gray-900 text-sm">
                      Most common trigger: <span className="font-semibold">{data.mostCommonTrigger}</span>
                    </p>
                    <p className="text-gray-500 text-xs mt-1">Track patterns to manage triggers</p>
                  </div>
                </div>
              )}
              
              {data.avgDuration > 0 && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-gray-900 text-sm">
                      Average duration: <span className="font-semibold">
                        {Math.floor(data.avgDuration / 60)}h {data.avgDuration % 60}m
                      </span>
                    </p>
                    <p className="text-gray-500 text-xs mt-1">Based on completed episodes</p>
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
