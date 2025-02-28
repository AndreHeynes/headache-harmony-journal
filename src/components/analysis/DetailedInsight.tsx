
import React from 'react';
import { 
  Brain, Gauge, Clock, Stethoscope, Zap, Pill, Sliders, Skull,
  X, BarChart2, LineChart, ArrowLeftRight, Target
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

interface DetailedInsightProps {
  type: string;
  onClose: () => void;
}

const mockPainAreaData = [
  { name: 'Forehead', value: 42 },
  { name: 'Temples', value: 28 },
  { name: 'Back of Head', value: 15 },
  { name: 'Neck', value: 10 },
  { name: 'Behind Eyes', value: 5 },
];

const mockIntensityData = [
  { date: 'Jan', mild: 5, moderate: 3, severe: 1 },
  { date: 'Feb', mild: 3, moderate: 4, severe: 2 },
  { date: 'Mar', mild: 4, moderate: 2, severe: 0 },
  { date: 'Apr', mild: 2, moderate: 5, severe: 3 },
  { date: 'May', mild: 6, moderate: 2, severe: 1 },
  { date: 'Jun', mild: 4, moderate: 3, severe: 0 },
];

const mockDurationData = [
  { date: 'Jan', average: 2.5, longest: 5 },
  { date: 'Feb', average: 3.2, longest: 8 },
  { date: 'Mar', average: 2.0, longest: 4 },
  { date: 'Apr', average: 3.5, longest: 9 },
  { date: 'May', average: 1.8, longest: 4 },
  { date: 'Jun', average: 2.2, longest: 6 },
];

const mockSymptomData = [
  { name: 'Nausea', count: 12 },
  { name: 'Sensitivity to light', count: 18 },
  { name: 'Sensitivity to sound', count: 14 },
  { name: 'Dizziness', count: 8 },
  { name: 'Fatigue', count: 20 },
];

const mockTriggerData = [
  { name: 'Stress', count: 15 },
  { name: 'Lack of sleep', count: 12 },
  { name: 'Dehydration', count: 8 },
  { name: 'Alcohol', count: 5 },
  { name: 'Weather changes', count: 10 },
];

const mockTreatmentData = [
  { name: 'Medication', effective: 75, ineffective: 25 },
  { name: 'Rest', effective: 60, ineffective: 40 },
  { name: 'Hydration', effective: 45, ineffective: 55 },
  { name: 'Massage', effective: 50, ineffective: 50 },
];

const mockCustomData = [
  { date: 'Jan', variable1: 5, variable2: 7 },
  { date: 'Feb', variable1: 3, variable2: 6 },
  { date: 'Mar', variable1: 6, variable2: 4 },
  { date: 'Apr', variable1: 4, variable2: 8 },
  { date: 'May', variable1: 7, variable2: 3 },
  { date: 'Jun', variable1: 5, variable2: 5 },
];

const mockNeckPainData = [
  { date: 'Week 1', painScore: 7 },
  { date: 'Week 2', painScore: 5 },
  { date: 'Week 3', painScore: 6 },
  { date: 'Week 4', painScore: 4 },
  { date: 'Week 5', painScore: 3 },
  { date: 'Week 6', painScore: 2 },
];

const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57'];

export const DetailedInsight: React.FC<DetailedInsightProps> = ({ type, onClose }) => {
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
      case 'pain-area': return <Brain className="h-6 w-6 text-indigo-400" />;
      case 'intensity': return <Gauge className="h-6 w-6 text-purple-400" />;
      case 'duration': return <Clock className="h-6 w-6 text-blue-400" />;
      case 'symptoms': return <Stethoscope className="h-6 w-6 text-red-400" />;
      case 'triggers': return <Zap className="h-6 w-6 text-yellow-400" />;
      case 'treatment': return <Pill className="h-6 w-6 text-teal-400" />;
      case 'custom': return <Sliders className="h-6 w-6 text-pink-400" />;
      case 'neck-pain': return <Skull className="h-6 w-6 text-orange-400" />;
      default: return <BarChart2 className="h-6 w-6 text-gray-400" />;
    }
  };

  const renderInsightContent = () => {
    switch (type) {
      case 'pain-area':
        return (
          <div className="space-y-6">
            <Card className="border-gray-700 bg-gray-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Pain Location Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockPainAreaData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockPainAreaData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <p className="text-gray-400 text-sm">
              Your headaches occur most frequently in the forehead area, followed by the temples. 
              This pattern is consistent with tension-type headaches.
            </p>
          </div>
        );
      
      case 'intensity':
        return (
          <div className="space-y-6">
            <Card className="border-gray-700 bg-gray-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Monthly Pain Intensity Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockIntensityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="date" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#555' }} />
                    <Legend />
                    <Bar dataKey="mild" name="Mild" fill="#82ca9d" />
                    <Bar dataKey="moderate" name="Moderate" fill="#8884d8" />
                    <Bar dataKey="severe" name="Severe" fill="#ff7300" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <p className="text-gray-400 text-sm">
              Your pain intensity trends show that mild headaches are most common, with occasional 
              severe episodes. April had the highest number of severe headaches.
            </p>
          </div>
        );
        
      case 'duration':
        return (
          <div className="space-y-6">
            <Card className="border-gray-700 bg-gray-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Headache Duration Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={mockDurationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="date" stroke="#999" />
                    <YAxis stroke="#999" label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: '#999' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#555' }} />
                    <Legend />
                    <Line type="monotone" dataKey="average" name="Average Duration" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="longest" name="Longest Episode" stroke="#ff7300" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <p className="text-gray-400 text-sm">
              Your average headache duration is 2.5 hours, with the longest episodes occurring in April.
              There's a correlation between duration and stress levels reported during these periods.
            </p>
          </div>
        );
        
      case 'symptoms':
        return (
          <div className="space-y-6">
            <Card className="border-gray-700 bg-gray-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Common Associated Symptoms</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart layout="vertical" data={mockSymptomData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis type="number" stroke="#999" />
                    <YAxis dataKey="name" type="category" stroke="#999" width={100} />
                    <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#555' }} />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <p className="text-gray-400 text-sm">
              Fatigue and sensitivity to light are your most common associated symptoms,
              which often indicate migraine-type headaches. These symptoms appear most
              frequently with severe headaches.
            </p>
          </div>
        );
        
      case 'triggers':
        return (
          <div className="space-y-6">
            <Card className="border-gray-700 bg-gray-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Common Triggers Identified</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart layout="vertical" data={mockTriggerData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis type="number" stroke="#999" />
                    <YAxis dataKey="name" type="category" stroke="#999" width={100} />
                    <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#555' }} />
                    <Bar dataKey="count" fill="#ff7300" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-3">
              <Card className="border-gray-700 bg-gray-800/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Trigger Correlation</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <div className="text-center">
                    <Target className="h-12 w-12 text-yellow-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">87%</p>
                    <p className="text-xs text-gray-400">Stress-headache correlation</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-gray-700 bg-gray-800/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Time to Onset</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <div className="text-center">
                    <Clock className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">2.5h</p>
                    <p className="text-xs text-gray-400">Average time after trigger</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
        
      case 'treatment':
        return (
          <div className="space-y-6">
            <Card className="border-gray-700 bg-gray-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Treatment Effectiveness</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockTreatmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#555' }} />
                    <Legend />
                    <Bar dataKey="effective" name="Effective %" fill="#82ca9d" />
                    <Bar dataKey="ineffective" name="Ineffective %" fill="#ff7300" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-3">
              <Card className="border-gray-700 bg-gray-800/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Response Time</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <div className="text-center">
                    <Clock className="h-12 w-12 text-teal-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">45m</p>
                    <p className="text-xs text-gray-400">Average relief time</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-gray-700 bg-gray-800/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Best Treatment</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <div className="text-center">
                    <Pill className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                    <p className="text-xl font-bold text-white">Medication</p>
                    <p className="text-xs text-gray-400">75% effectiveness</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
        
      case 'custom':
        return (
          <div className="space-y-6">
            <Card className="border-gray-700 bg-gray-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Custom Variables Correlation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={mockCustomData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="date" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#555' }} />
                    <Legend />
                    <Line type="monotone" dataKey="variable1" name="Sleep Quality" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="variable2" name="Caffeine Intake" stroke="#ff7300" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-3">
              <Card className="border-gray-700 bg-gray-800/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Correlation Strength</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <div className="text-center">
                    <ArrowLeftRight className="h-12 w-12 text-pink-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">68%</p>
                    <p className="text-xs text-gray-400">Sleep-headache correlation</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-gray-700 bg-gray-800/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Pattern Type</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                    <p className="text-xl font-bold text-white">Inverse</p>
                    <p className="text-xs text-gray-400">Pattern relationship</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <p className="text-gray-400 text-sm">
              Your custom tracking shows a strong inverse relationship between sleep quality and headache occurrence.
              When sleep quality decreases, headache frequency increases. Caffeine intake shows a moderate positive
              correlation with headache intensity.
            </p>
          </div>
        );
        
      case 'neck-pain':
        return (
          <div className="space-y-6">
            <Card className="border-gray-700 bg-gray-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Neck Pain Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={mockNeckPainData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="date" stroke="#999" />
                    <YAxis stroke="#999" label={{ value: 'Pain Score', angle: -90, position: 'insideLeft', fill: '#999' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#555' }} />
                    <Line type="monotone" dataKey="painScore" name="Neck Pain Score" stroke="#ff7300" activeDot={{ r: 8 }} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-3">
              <Card className="border-gray-700 bg-gray-800/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Neck Pain Relief</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <div className="text-center">
                    <Pill className="h-12 w-12 text-teal-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">62%</p>
                    <p className="text-xs text-gray-400">Massage effectiveness</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-gray-700 bg-gray-800/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Headache Link</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <div className="text-center">
                    <ArrowLeftRight className="h-12 w-12 text-orange-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">79%</p>
                    <p className="text-xs text-gray-400">Correlation strength</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <p className="text-gray-400 text-sm">
              Your neck pain has shown consistent improvement over the past 6 weeks, with a 71% reduction in overall pain scores.
              There's a strong correlation between neck pain reduction and decreased headache frequency.
            </p>
          </div>
        );
        
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">Select an insight type to view detailed analysis</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl border border-gray-700 p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getIcon()}
          <h2 className="text-xl font-semibold">{getTitle()}</h2>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {renderInsightContent()}
    </div>
  );
};
