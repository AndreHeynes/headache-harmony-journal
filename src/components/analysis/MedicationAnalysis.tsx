import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Pill, 
  AlertTriangle, 
  Loader2, 
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp
} from "lucide-react";
import { useMedicationAnalysis } from "@/hooks/useMedicationAnalysis";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function MedicationAnalysis() {
  const { 
    medications,
    totalMedicationDays,
    medicationOveruseRisk,
    overuseAlertCount,
    mostEffectiveMedication,
    loading,
    hasData
  } = useMedicationAnalysis();

  if (loading) {
    return (
      <section className="mb-6">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading medication data...</span>
        </div>
      </section>
    );
  }

  if (!hasData || medications.length === 0) {
    return (
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Pill className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Medication Analysis</h2>
        </div>
        <Card className="bg-card/50 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-muted-foreground">
              <AlertCircle className="h-5 w-5" />
              <p>No medication data recorded yet. Log treatments to see medication analysis.</p>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  const getSeverityColor = (severity: 'mild' | 'moderate' | 'severe') => {
    switch (severity) {
      case 'severe': return 'text-destructive bg-destructive/20';
      case 'moderate': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-green-400 bg-green-500/20';
    }
  };

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Pill className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Medication Analysis</h2>
        </div>
        {medicationOveruseRisk && (
          <span className="text-xs px-2 py-1 rounded bg-destructive/20 text-destructive">
            Overuse Risk
          </span>
        )}
      </div>

      {/* Overuse Alert */}
      {overuseAlertCount > 0 && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Medication Overuse Alert</AlertTitle>
          <AlertDescription>
            {overuseAlertCount} medication(s) may be overused. Frequent use of pain medications can lead to 
            medication overuse headaches. Consult your healthcare provider.
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Medication Days</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-foreground">{totalMedicationDays}</span>
              <span className="text-xs text-muted-foreground">/30 days</span>
            </div>
            {totalMedicationDays >= 15 && (
              <span className="text-xs text-destructive">High frequency</span>
            )}
          </CardContent>
        </Card>
        
        {mostEffectiveMedication && (
          <Card className="bg-card/50 border-border">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-xs text-muted-foreground">Most Effective</span>
              </div>
              <span className="text-sm font-medium text-foreground">{mostEffectiveMedication}</span>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Medication List */}
      <div className="space-y-3">
        {medications.slice(0, 5).map((med) => (
          <Card key={med.medication} className="bg-card/50 border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Pill className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">{med.medication}</span>
                </div>
                {med.overuseAlert && (
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                )}
              </div>

              {/* Usage Stats */}
              <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                <div>
                  <span className="text-muted-foreground">30d uses:</span>
                  <span className={`ml-1 font-medium ${med.overuseAlert ? 'text-destructive' : 'text-foreground'}`}>
                    {med.usesLast30Days}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">7d uses:</span>
                  <span className="ml-1 font-medium text-foreground">{med.usesLast7Days}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Avg relief:</span>
                  <span className="ml-1 font-medium text-foreground">{med.avgReliefTimeMinutes}m</span>
                </div>
              </div>

              {/* Effectiveness Bar */}
              {med.avgEffectiveness > 0 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Effectiveness</span>
                    <span className="text-foreground">{med.avgEffectiveness}/10</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all" 
                      style={{ width: `${(med.avgEffectiveness / 10) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Side Effects */}
              {med.sideEffects.length > 0 && (
                <div>
                  <span className="text-xs text-muted-foreground mb-2 block">Side Effects:</span>
                  <div className="flex flex-wrap gap-1">
                    {med.sideEffects.slice(0, 4).map((effect) => (
                      <span 
                        key={effect.effect}
                        className={`text-xs px-2 py-0.5 rounded ${getSeverityColor(effect.severity)}`}
                      >
                        {effect.effect} ({effect.percentageOfUses}%)
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Overuse Warning */}
              {med.overuseMessage && (
                <div className="mt-3 p-2 bg-destructive/10 rounded text-xs text-destructive">
                  {med.overuseMessage}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
