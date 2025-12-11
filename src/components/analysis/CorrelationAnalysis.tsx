import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoveHorizontal, Loader2, AlertCircle } from "lucide-react";
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis,
  Tooltip,
  Cell
} from 'recharts';
import { useCorrelationEngine } from "@/hooks/useCorrelationEngine";

// Color scale based on correlation strength
const getColor = (value: number) => {
  const maxValue = 15; 
  const ratio = value / maxValue;
  
  if (ratio < 0.33) {
    return 'hsl(var(--primary) / 0.4)'; // Low correlation
  } else if (ratio < 0.66) {
    return 'hsl(var(--primary) / 0.7)'; // Medium correlation
  } else {
    return 'hsl(var(--primary))'; // High correlation
  }
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border p-2 rounded-md shadow-md">
        <p className="text-foreground font-medium">{data.name}</p>
        <p className="text-muted-foreground text-sm">Correlation: {data.z}</p>
      </div>
    );
  }
  return null;
};

export function CorrelationAnalysis() {
  const { 
    painTriggerHeatmap, 
    durationTreatmentHeatmap, 
    loading, 
    hasData,
    triggerCorrelations,
    treatmentEffectiveness 
  } = useCorrelationEngine();

  if (loading) {
    return (
      <section className="mb-6">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading correlation data...</span>
        </div>
      </section>
    );
  }

  if (!hasData) {
    return (
      <section className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Correlation Analysis</h2>
        </div>
        <Card className="bg-card/50 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-muted-foreground">
              <AlertCircle className="h-5 w-5" />
              <p>No episode data available yet. Start logging headaches to see correlation analysis.</p>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  // Use real data or fallback to minimal display
  const displayTriggerData = painTriggerHeatmap.length > 0 ? painTriggerHeatmap : [];
  const displayTreatmentData = durationTreatmentHeatmap.length > 0 ? durationTreatmentHeatmap : [];

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Correlation Analysis</h2>
        <Button variant="ghost" size="icon" className="text-primary">
          <MoveHorizontal className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="space-y-3">
        {/* Top Trigger Correlations Summary */}
        {triggerCorrelations.length > 0 && (
          <Card className="bg-card/50 border-border">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Top Trigger Correlations</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-2">
                {triggerCorrelations.slice(0, 3).map((tc, index) => (
                  <div key={tc.trigger} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{tc.trigger}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        tc.riskLevel === 'high' ? 'bg-destructive/20 text-destructive' :
                        tc.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {tc.correlationScore}x
                      </span>
                      <span className="text-xs text-muted-foreground">({tc.occurrences} times)</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pain vs Triggers Heatmap */}
        {displayTriggerData.length > 0 && (
          <Card className="bg-card/50 border-border">
            <CardHeader className="p-4 pb-0">
              <CardTitle className="text-sm font-medium text-foreground">Pain vs. Triggers</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-36 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      name="Pain Intensity" 
                      domain={[0, 5]}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      tickCount={5}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y" 
                      name="Trigger Intensity" 
                      domain={[0, 5]}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      tickCount={5}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <ZAxis type="number" dataKey="z" range={[50, 500]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Scatter data={displayTriggerData}>
                      {displayTriggerData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getColor(entry.z)} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Treatment Effectiveness Summary */}
        {treatmentEffectiveness.length > 0 && (
          <Card className="bg-card/50 border-border">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Treatment Effectiveness</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-2">
                {treatmentEffectiveness.slice(0, 3).map((te) => (
                  <div key={te.treatment} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{te.treatment}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${te.effectivenessRate}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{te.effectivenessRate}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Duration vs Treatment Heatmap */}
        {displayTreatmentData.length > 0 && (
          <Card className="bg-card/50 border-border">
            <CardHeader className="p-4 pb-0">
              <CardTitle className="text-sm font-medium text-foreground">Duration vs. Treatment</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-36 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      name="Duration" 
                      domain={[0, 5]}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      tickCount={5}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y" 
                      name="Treatment Effectiveness" 
                      domain={[0, 5]}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      tickCount={5}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <ZAxis type="number" dataKey="z" range={[50, 500]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Scatter data={displayTreatmentData}>
                      {displayTreatmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getColor(entry.z)} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
