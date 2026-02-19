
import React from 'react';
import { 
  Brain, Gauge, Clock, Stethoscope, Zap, Pill, Sliders, Skull,
  X, BarChart2, LineChart, ArrowLeftRight, Target, AlertCircle, Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useDetailedInsights } from '@/hooks/useDetailedInsights';

interface DetailedInsightProps {
  type: string;
  onClose: () => void;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658', '#ff8042'];

export const DetailedInsight: React.FC<DetailedInsightProps> = ({ type, onClose }) => {
  const data = useDetailedInsights();

  const getTitle = () => {
    switch (type) {
      case 'pain-area': return 'Pain Area Analysis';
      case 'intensity': return 'Pain Intensity Trends';
      case 'duration': return 'Duration Analysis';
      case 'symptoms': return 'Associated Symptoms';
      case 'triggers': return 'Identified Triggers';
      case 'treatment': return 'Treatment Effectiveness';
      case 'custom': return 'Custom Variables Analysis';
      case 'neck-pain': return 'Neck Pain Progression';
      default: return 'Analysis';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'pain-area': return <Brain className="h-6 w-6 text-primary" />;
      case 'intensity': return <Gauge className="h-6 w-6 text-primary" />;
      case 'duration': return <Clock className="h-6 w-6 text-primary" />;
      case 'symptoms': return <Stethoscope className="h-6 w-6 text-destructive" />;
      case 'triggers': return <Zap className="h-6 w-6 text-accent-foreground" />;
      case 'treatment': return <Pill className="h-6 w-6 text-primary" />;
      case 'custom': return <Sliders className="h-6 w-6 text-primary" />;
      case 'neck-pain': return <Skull className="h-6 w-6 text-primary" />;
      default: return <BarChart2 className="h-6 w-6 text-muted-foreground" />;
    }
  };

  if (data.loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-4 shadow-lg flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading insights...</span>
      </div>
    );
  }

  if (!data.hasData) {
    return (
      <div className="bg-card border border-border rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">{getIcon()}<h2 className="text-xl font-semibold text-foreground">{getTitle()}</h2></div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></Button>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground p-8">
          <AlertCircle className="h-5 w-5" />
          <p>No episode data yet. Start logging headaches to see insights here.</p>
        </div>
      </div>
    );
  }

  const tooltipStyle = { backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' };

  const renderInsightContent = () => {
    switch (type) {
      case 'pain-area':
        return data.painAreaData.length > 0 ? (
          <div className="space-y-6">
            <Card className="border-border bg-card/50">
              <CardHeader className="pb-2"><CardTitle className="text-base font-medium text-foreground">Pain Location Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={data.painAreaData} cx="50%" cy="50%" labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80} fill="hsl(var(--primary))" dataKey="value">
                      {data.painAreaData.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <p className="text-muted-foreground text-sm">
              Your most frequent pain location is <strong className="text-foreground">{data.painAreaData[0].name}</strong> ({data.painAreaData[0].value} episodes).
            </p>
          </div>
        ) : <NoData />;

      case 'intensity':
        return data.intensityData.length > 0 ? (
          <div className="space-y-6">
            <Card className="border-border bg-card/50">
              <CardHeader className="pb-2"><CardTitle className="text-base font-medium text-foreground">Monthly Pain Intensity Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.intensityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                    <Bar dataKey="mild" name="Mild (1-3)" fill="#82ca9d" />
                    <Bar dataKey="moderate" name="Moderate (4-6)" fill="hsl(var(--primary))" />
                    <Bar dataKey="severe" name="Severe (7-10)" fill="hsl(var(--destructive))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        ) : <NoData />;

      case 'duration':
        return data.durationData.length > 0 ? (
          <div className="space-y-6">
            <Card className="border-border bg-card/50">
              <CardHeader className="pb-2"><CardTitle className="text-base font-medium text-foreground">Headache Duration Trends (hours)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={data.durationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                    <Line type="monotone" dataKey="average" name="Average" stroke="hsl(var(--primary))" activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="longest" name="Longest" stroke="hsl(var(--destructive))" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        ) : <NoData />;

      case 'symptoms':
        return data.symptomData.length > 0 ? (
          <div className="space-y-6">
            <Card className="border-border bg-card/50">
              <CardHeader className="pb-2"><CardTitle className="text-base font-medium text-foreground">Common Associated Symptoms</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart layout="vertical" data={data.symptomData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                    <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" width={120} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="count" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        ) : <NoData />;

      case 'triggers':
        return data.triggerData.length > 0 ? (
          <div className="space-y-6">
            <Card className="border-border bg-card/50">
              <CardHeader className="pb-2"><CardTitle className="text-base font-medium text-foreground">Common Triggers Identified</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart layout="vertical" data={data.triggerData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                    <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" width={120} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="count" fill="hsl(var(--accent))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-3">
              {data.topTriggerName && (
                <Card className="border-border bg-card/50">
                  <CardContent className="p-4 flex items-center justify-center">
                    <div className="text-center">
                      <Target className="h-10 w-10 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold text-foreground">{data.topTriggerScore}x</p>
                      <p className="text-xs text-muted-foreground">{data.topTriggerName} correlation</p>
                    </div>
                  </CardContent>
                </Card>
              )}
              {data.avgTriggerOnsetHours !== null && (
                <Card className="border-border bg-card/50">
                  <CardContent className="p-4 flex items-center justify-center">
                    <div className="text-center">
                      <Clock className="h-10 w-10 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold text-foreground">{data.avgTriggerOnsetHours}h</p>
                      <p className="text-xs text-muted-foreground">Avg time after trigger</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : <NoData />;

      case 'treatment':
        return data.treatmentData.length > 0 ? (
          <div className="space-y-6">
            <Card className="border-border bg-card/50">
              <CardHeader className="pb-2"><CardTitle className="text-base font-medium text-foreground">Treatment Effectiveness</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.treatmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                    <Bar dataKey="effective" name="Effective %" fill="#82ca9d" />
                    <Bar dataKey="ineffective" name="Ineffective %" fill="hsl(var(--destructive))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-3">
              <Card className="border-border bg-card/50">
                <CardContent className="p-4 flex items-center justify-center">
                  <div className="text-center">
                    <Clock className="h-10 w-10 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{data.avgReliefMinutes}m</p>
                    <p className="text-xs text-muted-foreground">Avg episode duration</p>
                  </div>
                </CardContent>
              </Card>
              {data.bestTreatmentName && (
                <Card className="border-border bg-card/50">
                  <CardContent className="p-4 flex items-center justify-center">
                    <div className="text-center">
                      <Pill className="h-10 w-10 text-primary mx-auto mb-2" />
                      <p className="text-lg font-bold text-foreground">{data.bestTreatmentName}</p>
                      <p className="text-xs text-muted-foreground">{data.bestTreatmentRate}% effective</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : <NoData />;

      case 'custom':
        return (
          <div className="flex items-center justify-center h-48">
            <div className="text-center text-muted-foreground">
              <Sliders className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Custom variable analysis will appear here once you log episodes with custom variables.</p>
            </div>
          </div>
        );

      case 'neck-pain':
        return data.neckPainData.length > 0 ? (
          <div className="space-y-6">
            <Card className="border-border bg-card/50">
              <CardHeader className="pb-2"><CardTitle className="text-base font-medium text-foreground">Neck Pain Intensity Over Time</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={data.neckPainData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="avgIntensity" name="Avg Intensity" stroke="hsl(var(--primary))" activeDot={{ r: 6 }} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-3">
              <Card className="border-border bg-card/50">
                <CardContent className="p-4 flex items-center justify-center">
                  <div className="text-center">
                    <Pill className="h-10 w-10 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{data.neckWithTreatmentRate}%</p>
                    <p className="text-xs text-muted-foreground">Treatment rate (with neck)</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border bg-card/50">
                <CardContent className="p-4 flex items-center justify-center">
                  <div className="text-center">
                    <ArrowLeftRight className="h-10 w-10 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{data.neckAssociatedPercent}%</p>
                    <p className="text-xs text-muted-foreground">Episodes with neck pain</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : <NoData />;

      default:
        return <NoData />;
    }
  };

  return (
    <div className="bg-card/95 backdrop-blur-sm rounded-xl border border-border p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getIcon()}
          <h2 className="text-xl font-semibold text-foreground">{getTitle()}</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground hover:bg-muted">
          <X className="h-5 w-5" />
        </Button>
      </div>
      {renderInsightContent()}
    </div>
  );
};

function NoData() {
  return (
    <div className="flex items-center gap-3 text-muted-foreground p-8 justify-center">
      <AlertCircle className="h-5 w-5" />
      <p>Not enough data for this insight yet.</p>
    </div>
  );
}
