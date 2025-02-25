
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Activity, ChartLine, Search } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-dark via-charcoal to-primary-dark">
      <div className="max-w-md mx-auto p-6 space-y-8 animate-fade-in">
        {/* Logo and Welcome Section */}
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center">
            <Activity className="w-12 h-12 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">
              Welcome
            </h1>
            <h2 className="text-xl text-white/80">
              My Headache Experience Journal!
            </h2>
          </div>
          <p className="text-white/60">
            Let's start the journey of developing a better understanding of your headache experience.
          </p>
        </div>

        {/* Feature Icons */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Activity, label: "Participate" },
            { icon: Search, label: "Understand" },
            { icon: ChartLine, label: "Recognize" }
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                <item.icon className="w-8 h-8 text-primary" />
              </div>
              <span className="text-white/80 text-sm">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 pt-4">
          <Button className="w-full bg-primary hover:bg-primary-dark text-charcoal font-semibold h-12">
            Let's Start
          </Button>
          <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 h-12">
            My Account
          </Button>
        </div>
      </div>
    </div>
  );
}
