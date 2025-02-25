
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, Activity } from "lucide-react";

export default function Index() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal">
            Headache Experience Journal
          </h1>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            Track your headache experiences, identify patterns, and gain valuable insights
            for better health management.
          </p>
        </section>

        {/* Quick Actions */}
        <Card className="glass p-6 animate-slide-in">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-charcoal">Ready to log your experience?</h2>
              <p className="text-charcoal/70">Record your headache details for better tracking.</p>
            </div>
            <Button className="bg-primary hover:bg-primary-dark text-charcoal" size="lg">
              <PlusCircle className="mr-2 h-5 w-5" />
              New Entry
            </Button>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="glass p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-charcoal">
              <Activity className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Recent Activity</h2>
            </div>
            <div className="text-center py-8 text-charcoal/60">
              <p>No entries yet. Start by adding your first headache experience.</p>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
