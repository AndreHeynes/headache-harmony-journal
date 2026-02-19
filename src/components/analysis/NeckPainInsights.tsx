
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useDetailedInsights } from "@/hooks/useDetailedInsights";

export function NeckPainInsights() {
  const { neckAssociatedPercent, neckWithTreatmentRate, neckWithoutTreatmentRate, loading, hasData } = useDetailedInsights();

  if (loading) {
    return (
      <section className="mb-6">
        <div className="flex items-center justify-center p-6">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground text-sm">Loading neck pain data...</span>
        </div>
      </section>
    );
  }

  if (!hasData) {
    return (
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Neck Pain Insights</h2>
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">No episode data yet to analyze neck pain correlations.</p>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Neck Pain Insights</h2>
        <Button variant="ghost" size="icon" className="text-primary">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="space-y-3">
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Associated Neck Pain</span>
              <span className="text-lg font-bold text-foreground">{neckAssociatedPercent}%</span>
            </div>
            <Progress value={neckAssociatedPercent} className="bg-muted h-2" />
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-sm font-medium text-foreground">Treatment Effectiveness</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">With Neck Pain</span>
              <span className="text-primary">{neckWithTreatmentRate}%</span>
            </div>
            <Progress value={neckWithTreatmentRate} className="bg-muted h-2 mt-1 mb-3" />
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Without Neck Pain</span>
              <span className="text-primary">{neckWithoutTreatmentRate}%</span>
            </div>
            <Progress value={neckWithoutTreatmentRate} className="bg-muted h-2 mt-1" />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
