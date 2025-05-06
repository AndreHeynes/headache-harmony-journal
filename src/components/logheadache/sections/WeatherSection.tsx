
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudRain, Sun, RefreshCw, ThermometerIcon } from "lucide-react";
import { getCurrentWeather, WeatherData, isPotentialWeatherTrigger } from "@/utils/weatherApi";
import { toast } from "sonner";
import { useTestContext } from "@/contexts/TestContext";

export function WeatherSection() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { premiumFeatures } = useTestContext();
  
  // Check if weather tracking is enabled in premium features
  const isEnabled = premiumFeatures.weather_tracking;

  const fetchWeatherData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getCurrentWeather();
      setWeatherData(data);
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
      console.error("Weather fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isEnabled) {
      fetchWeatherData();
    }
  }, [isEnabled]);

  // Get appropriate icon based on weather condition
  const getWeatherIcon = () => {
    if (!weatherData) return <CloudRain className="h-8 w-8 text-blue-400" />;
    
    switch (weatherData.condition.toLowerCase()) {
      case "sunny":
      case "partly cloudy":
        return <Sun className="h-8 w-8 text-yellow-400" />;
      case "rainy":
      case "stormy":
      case "snowy":
        return <CloudRain className="h-8 w-8 text-blue-400" />;
      default:
        return <CloudRain className="h-8 w-8 text-gray-400" />;
    }
  };

  if (!isEnabled) {
    return null; // Don't render if not enabled in premium features
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mb-4">
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-white">Current Weather</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchWeatherData}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-300"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        
        {error ? (
          <div className="text-center py-4">
            <p className="text-red-400">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchWeatherData}
              className="mt-2 border-gray-600"
            >
              Try Again
            </Button>
          </div>
        ) : weatherData ? (
          <div className="rounded-lg bg-gray-700/30 p-4 border border-gray-600">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getWeatherIcon()}
                <div>
                  <p className="text-lg font-medium text-white capitalize">{weatherData.condition}</p>
                  <p className="text-sm text-gray-400">{weatherData.location || "Current Location"}</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl font-semibold text-white">{weatherData.temperature}°</span>
                <span className="text-gray-400 text-sm">C</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center space-x-2 text-gray-300">
                <ThermometerIcon className="h-4 w-4 text-gray-400" />
                <span>Humidity: {weatherData.humidity}%</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <CloudRain className="h-4 w-4 text-gray-400" />
                <span>Pressure: {weatherData.pressure} hPa</span>
              </div>
            </div>
            
            {isPotentialWeatherTrigger(weatherData) && (
              <div className="mt-3 py-2 px-3 bg-yellow-500/20 border border-yellow-500/30 rounded text-sm text-yellow-200">
                This weather pattern may trigger headaches based on common triggers.
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <CloudRain className="h-10 w-10 mx-auto mb-2 text-gray-500" />
            <p>Loading weather data...</p>
          </div>
        )}
      </div>
    </Card>
  );
}
