
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoveHorizontal } from "lucide-react";
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

interface CorrelationData {
  x: number;
  y: number;
  z: number;
  name: string;
}

// Mock data for the heatmaps
const painTriggerData: CorrelationData[] = [
  { x: 1, y: 1, z: 10, name: 'Stress' },
  { x: 1, y: 2, z: 5, name: 'Caffeine' },
  { x: 2, y: 1, z: 8, name: 'Sleep' },
  { x: 2, y: 2, z: 15, name: 'Weather' },
  { x: 3, y: 3, z: 12, name: 'Screen Time' },
  { x: 3, y: 4, z: 3, name: 'Alcohol' },
  { x: 4, y: 3, z: 6, name: 'Exercise' },
  { x: 4, y: 4, z: 9, name: 'Food' },
];

const durationTreatmentData: CorrelationData[] = [
  { x: 1, y: 1, z: 14, name: 'Medication' },
  { x: 1, y: 2, z: 7, name: 'Rest' },
  { x: 2, y: 1, z: 9, name: 'Hydration' },
  { x: 2, y: 2, z: 12, name: 'Dark Room' },
  { x: 3, y: 3, z: 5, name: 'Caffeine' },
  { x: 3, y: 4, z: 8, name: 'Massage' },
  { x: 4, y: 3, z: 11, name: 'Cold Pack' },
  { x: 4, y: 4, z: 6, name: 'Hot Pack' },
];

// Color scale
const getColor = (value: number) => {
  // Scale from 0 to max possible value (e.g., 15)
  const maxValue = 15; 
  const ratio = value / maxValue;
  
  // Color scale from low to high correlation
  if (ratio < 0.33) {
    return '#a78bfa'; // Light purple (low correlation)
  } else if (ratio < 0.66) {
    return '#7c3aed'; // Medium purple (medium correlation)
  } else {
    return '#4c1d95'; // Dark purple (high correlation)
  }
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-800 border border-gray-700 p-2 rounded-md shadow-md">
        <p className="text-white font-medium">{data.name}</p>
        <p className="text-gray-300 text-sm">Correlation: {data.z}</p>
      </div>
    );
  }
  return null;
};

export function CorrelationAnalysis() {
  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Correlation Analysis</h2>
        <Button variant="ghost" size="icon" className="text-indigo-400">
          <MoveHorizontal className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="space-y-3">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-sm font-medium">Pain vs. Triggers</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                >
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Pain Intensity" 
                    domain={[0, 5]}
                    tick={{ fill: '#9ca3af' }}
                    tickCount={5}
                    axisLine={{ stroke: '#4b5563' }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Trigger Intensity" 
                    domain={[0, 5]}
                    tick={{ fill: '#9ca3af' }}
                    tickCount={5}
                    axisLine={{ stroke: '#4b5563' }}
                  />
                  <ZAxis 
                    type="number" 
                    dataKey="z" 
                    range={[50, 500]} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Scatter data={painTriggerData}>
                    {painTriggerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getColor(entry.z)} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-sm font-medium">Duration vs. Treatment</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                >
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Duration" 
                    domain={[0, 5]}
                    tick={{ fill: '#9ca3af' }}
                    tickCount={5}
                    axisLine={{ stroke: '#4b5563' }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Treatment Effectiveness" 
                    domain={[0, 5]}
                    tick={{ fill: '#9ca3af' }}
                    tickCount={5}
                    axisLine={{ stroke: '#4b5563' }}
                  />
                  <ZAxis 
                    type="number" 
                    dataKey="z" 
                    range={[50, 500]} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Scatter data={durationTreatmentData}>
                    {durationTreatmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getColor(entry.z)} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
