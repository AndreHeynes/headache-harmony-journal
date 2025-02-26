
import { Activity, ArrowRight, Clock, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import BottomNav from "@/components/layout/BottomNav";

export default function Dashboard() {
  // This would come from your auth/subscription system
  const isPremium = false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-dark via-charcoal to-primary-dark pb-20">
      {/* Header - Updated border opacity */}
      <header className="fixed top-0 w-full bg-charcoal/80 backdrop-blur-sm border-b border-white/5 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="font-bold text-white">My Headache Journal</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-white/10" />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 px-4 space-y-6">
        {/* Last Headache */}
        <Card className="bg-white/5 border-white/10">
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-white/60">Last Headache</p>
                <h2 className="text-2xl font-bold text-white">2 days ago</h2>
                <p className="text-white/60">Moderate intensity</p>
              </div>
              <div className="bg-primary/20 rounded-full h-12 w-12 flex items-center justify-center">
                <span className="text-primary font-bold">7/10</span>
              </div>
            </div>
            <Link to="/log">
              <Button className="w-full bg-primary hover:bg-primary-dark text-charcoal h-12">
                Log New Headache
              </Button>
            </Link>
          </div>
        </Card>

        {/* Weekly Overview */}
        <Card className="bg-white/5 border-white/10">
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-bold text-white">Weekly Overview</h2>
            <div className="grid grid-cols-7 gap-1">
              {[4, 6, 3, 5, 2, 6, 1].map((height, i) => (
                <div
                  key={i}
                  className="bg-primary/20 rounded"
                  style={{ height: `${height * 8}px` }}
                />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 pt-2">
              {[
                { value: "4", label: "Episodes" },
                { value: "6.2", label: "Avg Pain" },
                { value: "3h", label: "Duration" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Recent Entries */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Recent Entries</h2>
            <span className="text-primary text-sm cursor-pointer">View All</span>
          </div>
          {[
            { day: "Today", trigger: "Stress-induced", duration: "2h 30m", intensity: "8/10" },
            { day: "Yesterday", trigger: "Lack of sleep", duration: "4h", intensity: "6/10" },
            { day: "3 days ago", trigger: "Caffeine", duration: "1h 45m", intensity: "5/10" }
          ].map((entry, i) => (
            <Card key={i} className="bg-white/5 border-white/10">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-white/60">{entry.day}</div>
                    <div className="font-medium text-white">{entry.trigger}</div>
                    <div className="text-sm text-white/60">Duration: {entry.duration}</div>
                  </div>
                  <div className="bg-primary/20 rounded-lg px-3 py-1">
                    <span className="text-primary">{entry.intensity}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Insights */}
        <Card className="bg-white/5 border-white/10">
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-bold text-white">Quick Insights</h2>
            <div className="space-y-4">
              {/* Free Features */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-white/60">Most Common Trigger</div>
                  <div className="text-white">Stress</div>
                </div>
                <ArrowRight className="h-5 w-5 text-primary" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-white/60">Average Duration</div>
                  <div className="text-white">2h 45m</div>
                </div>
                <Clock className="h-5 w-5 text-primary" />
              </div>

              {/* Premium Features (Locked) */}
              {!isPremium && (
                <>
                  <div className="flex items-center justify-between opacity-50">
                    <div>
                      <div className="text-sm text-white/60">Pattern Analysis</div>
                      <div className="text-white">Most Common Times</div>
                    </div>
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex items-center justify-between opacity-50">
                    <div>
                      <div className="text-sm text-white/60">Trigger Correlation</div>
                      <div className="text-white">Impact Analysis</div>
                    </div>
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                </>
              )}

              {/* Upgrade Button */}
              <div className="bg-primary/10 rounded-lg p-3 cursor-pointer">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white">Upgrade for Full Insights</span>
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
