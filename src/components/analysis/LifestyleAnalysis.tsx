import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Moon, 
  Heart, 
  Loader2, 
  AlertCircle,
  TrendingUp,
  Lightbulb
} from "lucide-react";
import { useLifestyleAnalysis } from "@/hooks/useLifestyleAnalysis";

export function LifestyleAnalysis() {
  const { 
    sleepCorrelations,
    menstrualCorrelations,
    sleepQualityImpact,
    highRiskMenstrualPhase,
    hasSleepData,
    hasMenstrualData,
    recommendations,
    loading,
    hasData
  } = useLifestyleAnalysis();

  if (loading) {
    return (
      <section className="mb-6">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading lifestyle data...</span>
        </div>
      </section>
    );
  }

  if (!hasData || (!hasSleepData && !hasMenstrualData)) {
    return (
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Moon className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Lifestyle Factors</h2>
        </div>
        <Card className="bg-card/50 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-muted-foreground">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p>No sleep or menstrual cycle data detected in your triggers.</p>
                <p className="text-sm mt-1">Tip: Include "poor sleep", "good sleep", or menstrual phase in your triggers for lifestyle analysis.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  const getCorrelationColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'text-destructive bg-destructive/20';
      case 'moderate': return 'text-yellow-400 bg-yellow-500/20';
      case 'weak': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-destructive bg-destructive/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-green-400 bg-green-500/20';
    }
  };

  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Moon className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Lifestyle Factors</h2>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card className="bg-primary/5 border-primary/20 mb-4">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <span className="text-sm font-medium text-foreground">Insights</span>
                <ul className="mt-1 space-y-1">
                  {recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-muted-foreground">• {rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {/* Sleep Analysis */}
        {hasSleepData && (
          <Card className="bg-card/50 border-border">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-blue-400" />
                <CardTitle className="text-sm font-medium text-foreground">Sleep Quality Impact</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {sleepQualityImpact && (
                <p className="text-sm text-muted-foreground mb-3">{sleepQualityImpact}</p>
              )}
              <div className="space-y-2">
                {sleepCorrelations.map((sleep) => (
                  <div key={sleep.sleepQuality} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground">{sleep.sleepQuality} sleep</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${getCorrelationColor(sleep.correlationStrength)}`}>
                        {sleep.correlationStrength}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-foreground">{sleep.episodeCount} episodes</span>
                      <span className="text-xs text-muted-foreground ml-2">({sleep.avgPainIntensity}/10 avg)</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Menstrual Cycle Analysis */}
        {hasMenstrualData && (
          <Card className="bg-card/50 border-border">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-rose-400" />
                  <CardTitle className="text-sm font-medium text-foreground">Menstrual Cycle Patterns</CardTitle>
                </div>
                {highRiskMenstrualPhase && (
                  <span className="text-xs px-2 py-0.5 rounded bg-destructive/20 text-destructive">
                    High risk: {highRiskMenstrualPhase}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-2">
                {menstrualCorrelations.map((cycle) => (
                  <div key={cycle.phase} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground">{cycle.phase} phase</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${getRiskColor(cycle.riskLevel)}`}>
                        {cycle.riskLevel} risk
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-foreground">{cycle.episodeCount} episodes</span>
                      <span className="text-xs text-muted-foreground ml-2">({cycle.percentageOfEpisodes}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
