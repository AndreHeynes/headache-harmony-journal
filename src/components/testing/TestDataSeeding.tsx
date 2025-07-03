
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTestContext } from "@/contexts/TestContext";
import { toast } from "sonner";
import { Database, RotateCcw, Play, Download } from "lucide-react";

interface HeadachePattern {
  type: 'migraine' | 'tension' | 'cluster';
  frequency: 'daily' | 'weekly' | 'monthly';
  intensity: number;
  duration: number;
  locations: string[];
  triggers: string[];
}

const HEADACHE_PATTERNS: Record<string, HeadachePattern> = {
  migraine: {
    type: 'migraine',
    frequency: 'weekly',
    intensity: 8,
    duration: 4,
    locations: ['left-temple', 'forehead', 'eye-socket'],
    triggers: ['stress', 'bright-lights', 'certain-foods']
  },
  tension: {
    type: 'tension',
    frequency: 'daily',
    intensity: 5,
    duration: 2,
    locations: ['pressure-band', 'neck-base', 'both-temples'],
    triggers: ['stress', 'poor-posture', 'eye-strain']
  },
  cluster: {
    type: 'cluster',
    frequency: 'daily',
    intensity: 10,
    duration: 1,
    locations: ['right-eye', 'right-temple'],
    triggers: ['alcohol', 'strong-smells', 'weather-changes']
  }
};

export function TestDataSeeding() {
  const { logTestEvent, trackError } = useTestContext();
  const [selectedPattern, setSelectedPattern] = useState<string>('migraine');
  const [numberOfEntries, setNumberOfEntries] = useState<number>(10);
  const [isSeeding, setIsSeeding] = useState(false);

  const generateTestData = async () => {
    setIsSeeding(true);
    try {
      const pattern = HEADACHE_PATTERNS[selectedPattern];
      const testData = [];
      
      for (let i = 0; i < numberOfEntries; i++) {
        const entry = {
          id: `test-${Date.now()}-${i}`,
          timestamp: Date.now() - (i * 24 * 60 * 60 * 1000), // Spread over days
          type: pattern.type,
          intensity: pattern.intensity + Math.floor(Math.random() * 3) - 1, // ±1 variation
          duration: pattern.duration + Math.random() * 2 - 1, // ±1 hour variation
          locations: pattern.locations,
          triggers: pattern.triggers,
          notes: `Generated test entry for ${pattern.type} headache pattern`
        };
        testData.push(entry);
      }
      
      // Store in localStorage for testing purposes
      const existingData = JSON.parse(localStorage.getItem('testHeadacheData') || '[]');
      const updatedData = [...existingData, ...testData];
      localStorage.setItem('testHeadacheData', JSON.stringify(updatedData));
      
      logTestEvent({
        type: "action",
        details: `Generated ${numberOfEntries} test entries for ${selectedPattern} pattern`,
        component: "TestDataSeeding",
        metadata: { pattern: selectedPattern, entries: numberOfEntries }
      });
      
      toast.success(`Generated ${numberOfEntries} test ${selectedPattern} entries`, {
        description: "Test data has been seeded successfully"
      });
      
    } catch (error) {
      trackError(error, "TestDataSeeding", "medium", "Generating test data");
      toast.error("Failed to generate test data");
    } finally {
      setIsSeeding(false);
    }
  };

  const clearTestData = () => {
    localStorage.removeItem('testHeadacheData');
    logTestEvent({
      type: "action",
      details: "Cleared all test headache data",
      component: "TestDataSeeding"
    });
    toast.success("Test data cleared");
  };

  const exportTestData = () => {
    try {
      const testData = localStorage.getItem('testHeadacheData');
      if (!testData) {
        toast.info("No test data to export");
        return;
      }
      
      const dataStr = JSON.stringify(JSON.parse(testData), null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `test-headache-data-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      logTestEvent({
        type: "action",
        details: "Exported test headache data",
        component: "TestDataSeeding"
      });
      
      toast.success("Test data exported successfully");
    } catch (error) {
      trackError(error, "TestDataSeeding", "medium", "Exporting test data");
      toast.error("Failed to export test data");
    }
  };

  const currentTestDataCount = JSON.parse(localStorage.getItem('testHeadacheData') || '[]').length;

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Database className="h-5 w-5 text-purple-400" />
          Test Data Seeding System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white">Headache Pattern</Label>
            <Select value={selectedPattern} onValueChange={setSelectedPattern}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Select pattern type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="migraine">Migraine Pattern</SelectItem>
                <SelectItem value="tension">Tension Headache Pattern</SelectItem>
                <SelectItem value="cluster">Cluster Headache Pattern</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="entries" className="text-white">Number of Entries</Label>
            <Input
              id="entries"
              type="number"
              min="1"
              max="100"
              value={numberOfEntries}
              onChange={(e) => setNumberOfEntries(parseInt(e.target.value) || 1)}
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
        </div>

        <div className="bg-gray-900 p-3 rounded-md">
          <h4 className="text-white font-medium mb-2">Pattern Preview: {selectedPattern.charAt(0).toUpperCase() + selectedPattern.slice(1)}</h4>
          <div className="text-sm text-gray-300 grid grid-cols-2 gap-2">
            <div>Intensity: {HEADACHE_PATTERNS[selectedPattern].intensity}/10</div>
            <div>Duration: {HEADACHE_PATTERNS[selectedPattern].duration}h avg</div>
            <div>Frequency: {HEADACHE_PATTERNS[selectedPattern].frequency}</div>
            <div>Locations: {HEADACHE_PATTERNS[selectedPattern].locations.length} areas</div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Current test entries: <span className="text-white font-medium">{currentTestDataCount}</span>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportTestData}
              disabled={currentTestDataCount === 0}
              className="text-gray-300 border-gray-700"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearTestData}
              disabled={currentTestDataCount === 0}
              className="text-red-300 border-red-700"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Clear
            </Button>
            <Button
              onClick={generateTestData}
              disabled={isSeeding}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Play className="h-4 w-4 mr-1" />
              {isSeeding ? 'Generating...' : 'Generate Data'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
