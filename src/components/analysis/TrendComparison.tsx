import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Loader2, 
  AlertCircle,
  Calendar,
  Activity
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useTrendComparison } from "@/hooks/useTrendComparison";
import { format } from "date-fns";

interface TrendComparisonProps {
  monthsToAnalyze?: number;
}

export function TrendComparison({ monthsToAnalyze = 6 }: TrendComparisonProps) {
  const { 
    monthlyStats,
    trendChanges,
    frequencyTrend,
    intensityTrend,
    overallTrend,
    loading, 
    hasData,
    dataStartDate,
    monthsOfData
  } = useTrendComparison(monthsToAnalyze);

  if (loading) {
    return (
      <section className="mb-6">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading trend data...</span>
        </div>
      </section>
    );
  }

  if (!hasData) {
    return (
      <section className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Trend Comparison</h2>
        </div>
        <Card className="bg-card/50 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-muted-foreground">
              <AlertCircle className="h-5 w-5" />
              <p>No episode data available yet. Start logging headaches to see trend analysis.</p>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  const getTrendIcon = (trend: 'improving' | 'worsening' | 'stable') => {
    switch (trend) {
      case 'improving':
        return <TrendingDown className="h-4 w-4 text-green-400" />;
      case 'worsening':
        return <TrendingUp className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: 'improving' | 'worsening' | 'stable') => {
    switch (trend) {
      case 'improving':
        return 'text-green-400';
      case 'worsening':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getOverallTrendLabel = () => {
    switch (overallTrend) {
      case 'improving':
        return { label: 'Improving', color: 'bg-green-500/20 text-green-400' };
      case 'worsening':
        return { label: 'Needs Attention', color: 'bg-destructive/20 text-destructive' };
      default:
        return { label: 'Stable', color: 'bg-muted text-muted-foreground' };
    }
  };

  const overallLabel = getOverallTrendLabel();

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Trend Comparison</h2>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${overallLabel.color}`}>
          {overallLabel.label}
        </span>
      </div>

      {/* Data Period Info */}
      {dataStartDate && (
        <Card className="bg-card/50 border-border mb-3">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Analyzing {monthsOfData} months of data since {format(new Date(dataStartDate), 'MMM d, yyyy')}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Month-over-Month Changes */}
      {trendChanges.length > 0 && (
        <Card className="bg-card/50 border-border mb-3">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Month-over-Month Changes</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-2 gap-3">
              {trendChanges.map((change) => (
                <div key={change.metric} className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">{change.metric}</span>
                    {getTrendIcon(change.trend)}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-semibold text-foreground">
                      {change.currentValue}{change.unit}
                    </span>
                    <span className={`text-xs ${getTrendColor(change.trend)}`}>
                      {change.percentChange > 0 ? '+' : ''}{change.percentChange}%
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    vs {change.previousValue}{change.unit} last month
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Frequency Trend Chart */}
      {frequencyTrend.length > 1 && (
        <Card className="bg-card/50 border-border mb-3">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-sm font-medium text-foreground">Episode Frequency Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={frequencyTrend} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    name="Episodes"
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Intensity Trend Chart */}
      {intensityTrend.length > 1 && (
        <Card className="bg-card/50 border-border mb-3">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-sm font-medium text-foreground">Pain Intensity Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={intensityTrend} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    domain={[0, 10]}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="avg" 
                    name="Avg Pain"
                    stroke="hsl(var(--destructive))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--destructive))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monthly Summary Table */}
      {monthlyStats.length > 0 && (
        <Card className="bg-card/50 border-border">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground">Month</th>
                    <th className="text-center py-2 text-muted-foreground">Episodes</th>
                    <th className="text-center py-2 text-muted-foreground">Days</th>
                    <th className="text-center py-2 text-muted-foreground">Avg Pain</th>
                    <th className="text-left py-2 text-muted-foreground">Top Trigger</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyStats.slice(-4).map((month) => (
                    <tr key={month.month} className="border-b border-border/50">
                      <td className="py-2 text-foreground">{month.monthLabel}</td>
                      <td className="text-center py-2 text-foreground">{month.episodeCount}</td>
                      <td className="text-center py-2 text-foreground">{month.headacheDays}</td>
                      <td className="text-center py-2 text-foreground">{month.avgPainIntensity}/10</td>
                      <td className="py-2 text-muted-foreground">{month.topTrigger || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
