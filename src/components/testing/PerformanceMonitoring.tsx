
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTestContext } from "@/contexts/TestContext";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { Activity, Zap, Clock, TrendingUp } from "lucide-react";

interface PerformanceMetric {
  timestamp: number;
  component: string;
  renderTime: number;
  interactionDelay: number;
  memoryUsage: number;
}

export function PerformanceMonitoring() {
  const { logTestEvent } = useTestContext();
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const performanceObserverRef = useRef<PerformanceObserver | null>(null);

  // Performance monitoring functions
  const startMonitoring = () => {
    setIsMonitoring(true);
    
    // Create Performance Observer for measuring paint and navigation timing
    if ('PerformanceObserver' in window) {
      performanceObserverRef.current = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'measure' || entry.entryType === 'navigation') {
            const metric: PerformanceMetric = {
              timestamp: Date.now(),
              component: entry.name || 'Navigation',
              renderTime: entry.duration,
              interactionDelay: 0,
              memoryUsage: getMemoryUsage()
            };
            setMetrics(prev => [...prev.slice(-49), metric]); // Keep last 50 metrics
          }
        });
      });
      
      try {
        performanceObserverRef.current.observe({ entryTypes: ['measure', 'navigation'] });
      } catch (error) {
        console.warn('Performance Observer not fully supported:', error);
      }
    }

    // Start interval monitoring
    intervalRef.current = setInterval(() => {
      measureCurrentPerformance();
    }, 2000);

    logTestEvent({
      type: "action",
      details: "Started performance monitoring",
      component: "PerformanceMonitoring"
    });
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (performanceObserverRef.current) {
      performanceObserverRef.current.disconnect();
      performanceObserverRef.current = null;
    }

    logTestEvent({
      type: "action",
      details: "Stopped performance monitoring",
      component: "PerformanceMonitoring"
    });
  };

  const measureCurrentPerformance = () => {
    const now = performance.now();
    
    // Measure a simple DOM operation to simulate component interaction
    const startTime = performance.now();
    document.querySelector('body'); // Simple DOM query
    const endTime = performance.now();
    
    const metric: PerformanceMetric = {
      timestamp: Date.now(),
      component: 'Current Page',
      renderTime: endTime - startTime,
      interactionDelay: Math.random() * 10, // Simulated interaction delay
      memoryUsage: getMemoryUsage()
    };
    
    setMetrics(prev => [...prev.slice(-49), metric]);
  };

  const getMemoryUsage = (): number => {
    // @ts-ignore - performance.memory is not in all browsers
    if (performance.memory) {
      // @ts-ignore
      return Math.round(performance.memory.usedJSHeapSize / 1024 / 1024); // MB
    }
    return 0;
  };

  const clearMetrics = () => {
    setMetrics([]);
    logTestEvent({
      type: "action",
      details: "Cleared performance metrics",
      component: "PerformanceMonitoring"
    });
  };

  // Calculate average metrics
  const avgRenderTime = metrics.length > 0 
    ? (metrics.reduce((sum, m) => sum + m.renderTime, 0) / metrics.length).toFixed(2)
    : '0.00';
  
  const avgMemoryUsage = metrics.length > 0
    ? (metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / metrics.length).toFixed(1)
    : '0.0';

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (performanceObserverRef.current) performanceObserverRef.current.disconnect();
    };
  }, []);

  // Prepare chart data
  const chartData = metrics.slice(-20).map((metric, index) => ({
    index: index + 1,
    renderTime: parseFloat(metric.renderTime.toFixed(2)),
    memory: metric.memoryUsage,
    delay: parseFloat(metric.interactionDelay.toFixed(2))
  }));

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-400" />
            Performance Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              Status: <span className={`font-medium ${isMonitoring ? 'text-green-400' : 'text-red-400'}`}>
                {isMonitoring ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearMetrics}
                disabled={metrics.length === 0}
                className="text-gray-300 border-gray-700"
              >
                Clear Data
              </Button>
              <Button
                onClick={isMonitoring ? stopMonitoring : startMonitoring}
                className={isMonitoring ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
              >
                {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-900 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-blue-400" />
                <span className="text-gray-400 text-sm">Avg Render Time</span>
              </div>
              <p className="text-lg font-bold text-white">{avgRenderTime}ms</p>
            </div>
            
            <div className="bg-gray-900 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="text-gray-400 text-sm">Memory Usage</span>
              </div>
              <p className="text-lg font-bold text-white">{avgMemoryUsage}MB</p>
            </div>
            
            <div className="bg-gray-900 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-purple-400" />
                <span className="text-gray-400 text-sm">Samples</span>
              </div>
              <p className="text-lg font-bold text-white">{metrics.length}</p>
            </div>
            
            <div className="bg-gray-900 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="h-4 w-4 text-green-400" />
                <span className="text-gray-400 text-sm">Status</span>
              </div>
              <p className="text-lg font-bold text-white">{isMonitoring ? 'Live' : 'Stopped'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {metrics.length > 0 && (
        <>
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Render Time Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="index" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      formatter={(value, name) => [`${value}${name === 'renderTime' ? 'ms' : name === 'memory' ? 'MB' : 'ms'}`, name === 'renderTime' ? 'Render Time' : name === 'memory' ? 'Memory' : 'Delay']}
                      contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }}
                    />
                    <Line type="monotone" dataKey="renderTime" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Memory Usage Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.slice(-10)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="index" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      formatter={(value) => [`${value}MB`, 'Memory Usage']}
                      contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }}
                    />
                    <Bar dataKey="memory" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
