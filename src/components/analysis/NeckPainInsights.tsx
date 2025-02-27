
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function NeckPainInsights() {
  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Neck Pain Insights</h2>
        <Button variant="ghost" size="icon" className="text-indigo-400">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="space-y-3">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Associated Neck Pain</span>
              <span className="text-lg font-bold">68%</span>
            </div>
            <Progress value={68} className="bg-gray-700/30 h-2" indicatorClassName="bg-indigo-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-sm font-medium">Treatment Effectiveness</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">With Neck Pain</span>
              <span className="text-indigo-400">45%</span>
            </div>
            <Progress value={45} className="bg-gray-700/30 h-2 mt-1 mb-3" indicatorClassName="bg-indigo-400" />
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Without Neck Pain</span>
              <span className="text-teal-400">72%</span>
            </div>
            <Progress value={72} className="bg-gray-700/30 h-2 mt-1" indicatorClassName="bg-teal-400" />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
