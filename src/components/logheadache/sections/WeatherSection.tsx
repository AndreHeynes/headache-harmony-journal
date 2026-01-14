import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudRain, Sun, RefreshCw, ThermometerIcon } from "lucide-react";
import { getCurrentWeather, WeatherData, isPotentialWeatherTrigger } from "@/utils/weatherApi";
import { useTestContext } from "@/contexts/TestContext";

interface WeatherSectionProps {
  onWeatherCapture?: (weatherTrigger: string) => void;
}

export function WeatherSection({ onWeatherCapture }: WeatherSectionProps) {
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
      
      // Notify parent component of weather data for persistence
      if (data && onWeatherCapture) {
        const weatherTrigger = `Weather: ${data.condition}, ${data.temperature}°C, ${data.humidity}% humidity, ${data.pressure}hPa`;
        onWeatherCapture(weatherTrigger);
      }
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
    if (!weatherData) return <CloudRain className="h-8 w-8 text-blue-500" />;
    
    switch (weatherData.condition.toLowerCase()) {
      case "sunny":
      case "partly cloudy":
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case "rainy":
      case "stormy":
      case "snowy":
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <CloudRain className="h-8 w-8 text-muted-foreground" />;
    }
  };

  if (!isEnabled) {
    return null; // Don't render if not enabled in premium features
  }

  return (
    <Card className="mb-4">
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-foreground">Current Weather</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchWeatherData}
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        
        {error ? (
          <div className="text-center py-4">
            <p className="text-destructive">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchWeatherData}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        ) : weatherData ? (
          <div className="rounded-lg bg-muted/50 p-4 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getWeatherIcon()}
                <div>
                  <p className="text-lg font-medium text-foreground capitalize">{weatherData.condition}</p>
                  <p className="text-sm text-muted-foreground">{weatherData.location || "Current Location"}</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl font-semibold text-foreground">{weatherData.temperature}°</span>
                <span className="text-muted-foreground text-sm">C</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <ThermometerIcon className="h-4 w-4" />
                <span>Humidity: {weatherData.humidity}%</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <CloudRain className="h-4 w-4" />
                <span>Pressure: {weatherData.pressure} hPa</span>
              </div>
            </div>
            
            {isPotentialWeatherTrigger(weatherData) && (
              <div className="mt-3 py-2 px-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                This weather pattern may trigger headaches based on common triggers.
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <CloudRain className="h-10 w-10 mx-auto mb-2" />
            <p>Loading weather data...</p>
          </div>
        )}
      </div>
    </Card>
  );
}
